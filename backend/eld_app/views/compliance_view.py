from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Sum, F, ExpressionWrapper, fields
from ..models import Trip, LogEntry
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_compliance_log(trip_id):
    """
    Generates HOS compliance log for a specific trip, including ELD data.
    """
    today = now().date()
    eight_days_ago = today - timedelta(days=8)

    # Fetch the trip
    trip = Trip.objects.filter(id=trip_id).first()
    if not trip:
        return {"message": "Trip not found."}

    # Fetch log entries for the trip, ordered by start_time
    logs = LogEntry.objects.filter(trip=trip).order_by('start_time')

    if not logs.exists():
        return {"message": "No log entries found for this trip."}

    # Annotate duration
    logs = logs.annotate(
        duration=ExpressionWrapper(F('end_time') - F('start_time'), output_field=fields.DurationField())
    )

    # Convert start_time and end_time to hours from midnight
    eld_data = []
    for log in logs:
        start_hour = log.start_time.hour + log.start_time.minute / 60
        end_hour = log.end_time.hour + log.end_time.minute / 60
        eld_data.append({
            "label": log.status,
            "start": round(start_hour, 2),
            "end": round(end_hour, 2)
        })

    # Compliance calculations
    driving_duration = logs.filter(status="Driving").aggregate(Sum('duration'))['duration__sum'] or timedelta()
    on_duty_duration = logs.filter(status__in=["Driving", "On Duty (not driving)"]).aggregate(Sum('duration'))['duration__sum'] or timedelta()
    off_duty_duration = logs.filter(status="Off Duty").aggregate(Sum('duration'))['duration__sum'] or timedelta()
    sleeper_berth_duration = logs.filter(status="Sleeper Berth").aggregate(Sum('duration'))['duration__sum'] or timedelta()

    driving_hours = driving_duration.total_seconds() / 3600
    on_duty_hours = on_duty_duration.total_seconds() / 3600
    off_duty_hours = off_duty_duration.total_seconds() / 3600
    sleeper_berth_hours = sleeper_berth_duration.total_seconds() / 3600

    # Compute total on-duty hours in the past 8 days
    total_on_duty_duration_8_days = LogEntry.objects.filter(
        trip__user=trip.user,
        start_time__date__gte=eight_days_ago,
        status__in=["Driving", "On Duty (not driving)"]
    ).annotate(
        duration=ExpressionWrapper(F('end_time') - F('start_time'), output_field=fields.DurationField())
    ).aggregate(Sum('duration'))['duration__sum'] or timedelta()

    total_on_duty_hours_8_days = total_on_duty_duration_8_days.total_seconds() / 3600

    # Fueling check
    last_refuel = logs.filter(activity="Fueling").order_by('-start_time').first()
    last_fuel_mileage = last_refuel.route_distance_from_start_point / 1609.34 if last_refuel else 0  # Convert meters to miles
    total_trip_miles = (trip.distance_from_current_pickup + trip.distance_from_pickup_dropoff) / 1609.34  # Convert meters to miles
    needs_refuel = (total_trip_miles - last_fuel_mileage) >= 1000

    # Pickup/Drop-off compliance
    pickup_dropoff_duration = logs.filter(activity__in=["Pickup", "Drop-off"]).aggregate(Sum('duration'))['duration__sum'] or timedelta()
    pickup_dropoff_violation = pickup_dropoff_duration.total_seconds() / 3600 < 1

    # Violations tracking
    violations = []
    if driving_hours > 11:
        violations.append(f"Exceeded 11-hour driving limit: {driving_hours:.2f} hours.")
    if on_duty_hours > 14:
        violations.append(f"Exceeded 14-hour duty limit: {on_duty_hours:.2f} hours.")
    if off_duty_hours + sleeper_berth_hours < 10:
        violations.append(f"Failed to take required 10-hour break: Only {off_duty_hours + sleeper_berth_hours:.2f} hours recorded.")
    if total_on_duty_hours_8_days > 70:
        violations.append(f"Exceeded 70-hour limit in 8 days: {total_on_duty_hours_8_days:.2f} hours.")
    if sleeper_berth_hours < 7 or off_duty_hours < 2:
        violations.append(f"Sleeper berth rule violated: {sleeper_berth_hours:.2f} hours in berth, {off_duty_hours:.2f} hours off-duty.")
    if needs_refuel:
        violations.append(f"Refueling required: More than 1,000 miles since last refuel.")
    if pickup_dropoff_violation:
        violations.append("Pickup/Drop-off time less than required 1 hour.")

    # Construct compliance log
    compliance_log = {
        "trip_id": trip.id,
        "user": trip.user.username,
        "daily_driving_hours": round(driving_hours, 2),
        "daily_on_duty_hours": round(on_duty_hours, 2),
        "off_duty_hours": round(off_duty_hours, 2),
        "sleeper_berth_hours": round(sleeper_berth_hours, 2),
        "total_on_duty_hours_8_days": round(total_on_duty_hours_8_days, 2),
        "needs_refuel": needs_refuel,
        "pickup_dropoff_violation": pickup_dropoff_violation,
        "violations": violations,
        "eld_data": eld_data  # Added ELD log entries here
    }

    return compliance_log
