from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Trip, LogEntry, UserStatus
from ..serializers import TripSerializer, LogEntrySerializer, UserStatusSerializer

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
    data = trips.values()
    return Response(list(data))


from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def end_trip(request):
    user = request.user
    data = request.data

    trip_id = data.get("trip_id")
    end_time = data.get("end_time")

    # Validate required fields
    if not trip_id or not end_time:
        return Response({
            "error": "trip_id and end_time are required"
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        trip = Trip.objects.get(id=trip_id, user=user)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

    last_log = LogEntry.objects.filter(trip=trip).order_by("-start_time").first()

    with transaction.atomic():
        # Update last log entry if it exists
        if last_log:
            log_update_serializer = LogEntrySerializer(last_log, data={"end_time": end_time}, partial=True)
            if log_update_serializer.is_valid():
                updated_log = log_update_serializer.save()
            else:
                return Response(log_update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        # Update user status
        user_status = UserStatus.objects.get(user=user)
        status_serializer = UserStatusSerializer(user_status, data={"status": '', "trip": None }, partial=True)
        if status_serializer.is_valid():
            new_status = status_serializer.save()
        else:
            return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    return Response({
        "message": "Trip ended, user status and log updated",
        "last_log_entry": LogEntrySerializer(updated_log).data,
        "user_status": UserStatusSerializer(new_status).data,
    }, status=status.HTTP_200_OK)


