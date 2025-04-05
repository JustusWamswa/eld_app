# HOS Regulations
# ==================
# 70-hour/8-day rule
# 11-hour driving rule
# 14-hour on-duty limit
# Sleeper Berth / Off Duty compliance
# Refueling every ≤ 1,000 miles
# Pickup/drop-off max duration of 1 hr



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
def generate_compliance_log(request, trip_id):
    """
    Generates HOS compliance log for a specific trip, including ELD data.
    """
    # Fetch the trip
    trip = Trip.objects.filter(id=trip_id).first()
    if not trip:
        return Response({"message": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

    # Fetch log entries for the trip, ordered by start_time
    logs = LogEntry.objects.filter(trip=trip).order_by('start_time')

    if not logs.exists():
        return Response({"message": "No log entries found for this trip."}, status=status.HTTP_404_NOT_FOUND)

    # Annotate duration
    logs = logs.annotate(
        duration=ExpressionWrapper(F('end_time') - F('start_time'), output_field=fields.DurationField())
    )

    # ==========================================

    # Prepare data for visualization 
    eld_data = []
    for log in logs:
        start_hour = log.start_time.hour + log.start_time.minute / 60
        end_hour = log.end_time.hour + log.end_time.minute / 60
        eld_data.append({
            "label": log.status,
            "start": round(start_hour, 2),
            "end": round(end_hour, 2),
            "remarks": log.remarks
        })

    transformed_eld_data = eld_data.copy()

    # Add an initial 'Off Duty' entry if the first entry doesn't start at hour 0
    if transformed_eld_data:
        first_entry = transformed_eld_data[0]
        if first_entry["start"] > 0:
            transformed_eld_data.insert(0, {
                "label": "Off Duty",
                "start": 0,
                "end": first_entry["start"],
                "remarks": ""
            })

        # Add a final 'Off Duty' entry if the last entry doesn't end at hour 24
        last_entry = transformed_eld_data[-1]
        if last_entry["end"] < 24:
            transformed_eld_data.append({
                "label": "Off Duty",
                "start": last_entry["end"],
                "end": 24,
                "remarks": ""
            })

    # Separate data if trip spans more than a day
    eld_data_by_day = []
    current_day_logs = []

    for entry in transformed_eld_data:
        start = entry["start"]
        end = entry["end"]
        label = entry["label"]
        remarks = entry.get("remarks", "")

        # Handle logs that span across midnight (e.g., 23 to 1)
        if end < start:
            # First part until midnight
            current_day_logs.append({
                "label": label,
                "start": start,
                "end": 24,
                "remarks": remarks
            })
            eld_data_by_day.append(current_day_logs)
            current_day_logs = []

            # Second part starting from midnight on next day
            current_day_logs.append({
                "label": label,
                "start": 0,
                "end": end,
                "remarks": remarks
            })
        elif end == 24:
            # Full hour span until midnight
            current_day_logs.append({
                "label": label,
                "start": start,
                "end": end,
                "remarks": remarks
            })
            eld_data_by_day.append(current_day_logs)
            current_day_logs = []
        else:
            current_day_logs.append({
                "label": label,
                "start": start,
                "end": end,
                "remarks": remarks
            })

    # Add any remaining logs for the final day
    if current_day_logs:
        eld_data_by_day.append(current_day_logs)


    # Compliance calculations
    # ==========================================

    # Initialize counters
    driving_hours = 0
    on_duty_hours = 0
    off_duty_hours = 0
    sleeper_berth_hours_1 = 0
    sleeper_berth_hours_2 = 0
    sleeper_berth_hours_3 = 0

    consecutive_driving = 0  # Track continuous driving without a break
    last_off_duty = 0  # Track last off-duty period for split-sleeper rule

    # Violations tracking
    violations = []

    # Iterate over transformed ELD data
    for entry in transformed_eld_data:
        duration = entry["end"] - entry["start"]
        
        if entry["label"] == "Driving":
            driving_hours += duration
            consecutive_driving += duration
            on_duty_hours += duration

            if driving_hours > 11:
                violations.append(f"Exceeded 11-hour driving limit: {driving_hours:.2f} hours.")

            if consecutive_driving > 8:
                violations.append(f"Missing 30-minute break after 8 consecutive driving hours.")

        elif entry["label"] == "On Duty (not driving)":
            on_duty_hours += duration
            consecutive_driving = 0

        elif entry["label"] == "Sleeper Berth":
            if duration > 7:
                sleeper_berth_hours_1 += duration
            if duration <= 3:
                sleeper_berth_hours_2 += duration
            if duration >= 2:
                sleeper_berth_hours_3 += duration
            consecutive_driving = 0
            # last_off_duty = duration  

        elif entry["label"] == "Off Duty":
            off_duty_hours += duration
            consecutive_driving = 0
            last_off_duty = duration

        if on_duty_hours > 14:
            violations.append(f"Exceeded 14-hour duty limit: {on_duty_hours:.2f} hours.")

    # Check Off-Duty and Sleeper Compliance
    if off_duty_hours < 10: 
        if sleeper_berth_hours_1 < 7:
                violations.append(f"Failed to take required 10-hour break")
        if sleeper_berth_hours_1 >= 7:
            if sleeper_berth_hours_1 + sleeper_berth_hours_2 < 10 or sleeper_berth_hours_1 + sleeper_berth_hours_3 < 10:
                violations.append(f"Failed to take required 10-hour break")


    # Fueling check
    fuel_logs = logs.filter(activity="Fueling").order_by('route_distance_from_start_point')
    fuel_mileages = [log.route_distance_from_start_point / 1609.34 for log in fuel_logs]

    # Include start of trip (0 miles) and end of trip mileage
    start_mileage = 0
    end_mileage = (trip.distance_from_current_pickup + trip.distance_from_pickup_dropoff) / 1609.34
    mile_checkpoints = [start_mileage] + fuel_mileages + [end_mileage]

    # Check for any interval > 1000 miles
    needs_refuel = False
    for i in range(1, len(mile_checkpoints)):
        if (mile_checkpoints[i] - mile_checkpoints[i - 1]) > 1000:
            needs_refuel = True
            break


    # Pickup/Drop-off compliance
    pickup_dropoff_duration = logs.filter(activity__in=["Pickup", "Dropoff"]).aggregate(Sum('duration'))['duration__sum'] or timedelta()
    pickup_dropoff_violation = pickup_dropoff_duration.total_seconds() / 3600 > 1

    if needs_refuel:
        violations.append(f"Refueling required: More than 1,000 miles since last refuel.")
    if pickup_dropoff_violation:
        violations.append("Pickup/Drop-off time more than required 1 hour.")


    # Construct compliance log
    compliance_log = {
        "trip_id": trip.id,
        "user": trip.user.username,
        "violations": violations,
        # "eld_data": eld_data, 
        "eld_data_by_day": eld_data_by_day 
    }

    return Response(compliance_log)

