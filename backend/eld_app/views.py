from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer
from datetime import timedelta

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer

@api_view(['GET'])
def index(request):
    return Response("<h4 style='text-align:center; margin-top:50;'>ELD APP</h4>")

@api_view(['GET'])
def get_trip_logs(request, trip_id):
    logs = LogEntry.objects.filter(trip_id=trip_id)
    serializer = LogEntrySerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def generate_eld_logs(request, trip_id):
    trip = Trip.objects.get(id=trip_id)
    logs = []
    
    time_elapsed = 0  # Total minutes elapsed in the 70-hour cycle
    cycle_limit = 70 * 60  # 70 hours in minutes
    driving_limit = 11 * 60  # 11 hours in minutes per shift
    on_duty_limit = 14 * 60  # 14 hours total per shift
    fuel_interval = 16.7 * 60  # Fuel stop every ~16.7 hours (1,000 miles)
    
    current_time = trip.created_at
    shift_elapsed = 0  # Track time within the current 14-hour on-duty window
    last_fuel_time = 0  # Track last fuel stop

    while time_elapsed < cycle_limit:
        if shift_elapsed + driving_limit <= on_duty_limit and time_elapsed + driving_limit <= cycle_limit:
            logs.append({
                "timestamp": current_time,
                "status": "Driving",
                "remarks": "Continuing route"
            })
            current_time += timedelta(minutes=driving_limit)
            shift_elapsed += driving_limit
            time_elapsed += driving_limit

        # Check if it's time for a fuel stop (every 1,000 miles)
        if time_elapsed - last_fuel_time >= fuel_interval:
            logs.append({
                "timestamp": current_time,
                "status": "On Duty",
                "remarks": "Fuel stop"
            })
            current_time += timedelta(minutes=30)
            shift_elapsed += 30
            time_elapsed += 30
            last_fuel_time = time_elapsed  # Reset fuel counter

        if shift_elapsed < on_duty_limit:
            logs.append({
                "timestamp": current_time,
                "status": "On Duty",
                "remarks": "Mandatory break"
            })
            current_time += timedelta(minutes=30)
            shift_elapsed += 30
            time_elapsed += 30

        # End shift if 14-hour limit reached
        if shift_elapsed >= on_duty_limit:
            logs.append({
                "timestamp": current_time,
                "status": "Sleeping",
                "remarks": "Rest period"
            })
            current_time += timedelta(hours=10)
            time_elapsed += 600  # 10-hour rest period
            shift_elapsed = 0  # Reset shift timer

    return Response({"trip_id": trip_id, "logs": logs})

