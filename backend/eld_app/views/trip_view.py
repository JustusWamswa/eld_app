from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Trip, LogEntry
from ..serializers import TripSerializer, LogEntrySerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_trip(request):
    data = request.data
    data["user"] = request.user.id

    # Ensure lat and lng are rounded to 8 decimal places
    for key in data:
        if "lat" in key or "lng" in key:
            try:
                data[key] = round(float(data[key]), 8)
            except (ValueError, TypeError):
                return Response({key: "Invalid latitude/longitude value"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = TripSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_trip_by_id(request, trip_id):
    try:
        trip = Trip.objects.get(id=trip_id, user=request.user)
        serializer = TripSerializer(trip)
        
        logs = LogEntry.objects.filter(trip=trip)
        logs_serializer = LogEntrySerializer(logs, many=True)

        return Response({
            "trip": serializer.data,
            "logs": logs_serializer.data
        })
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_trips_by_user(request):
    trips = Trip.objects.filter(user=request.user)
    data = trips.values("id", "current_location_name", "pickup_location_name", "dropoff_location_name", "created_at")
    return Response(list(data))