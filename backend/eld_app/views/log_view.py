from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import LogEntry, Trip, UserStatus
from ..serializers import LogEntrySerializer, UserStatusSerializer
from django.db import transaction



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_log_entry(request):
    user = request.user
    data = request.data

    # Round lat/lng fields to 8 decimal places
    for key in data:
        if "lat" in key or "lng" in key:
            try:
                data[key] = round(float(data[key]), 8)
            except (ValueError, TypeError):
                return Response({key: "Invalid latitude/longitude value"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = LogEntrySerializer(data=data)

    if serializer.is_valid():
        trip = serializer.validated_data.get("trip")

        # Ensure the trip belongs to the authenticated user
        if trip.user != user:
            return Response({"error": "Unauthorized to add logs to this trip"}, status=status.HTTP_403_FORBIDDEN)

        # Create the LogEntry explicitly
        log_entry = LogEntry.objects.create(**serializer.validated_data)
        
        return Response({
            "message": "Log entry created",
            "log": LogEntrySerializer(log_entry).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_log_entry(request, log_id):
    user = request.user
    try:
        log_entry = LogEntry.objects.get(id=log_id)
    except LogEntry.DoesNotExist:
        return Response({"error": "Log entry not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the log entry belongs to the authenticated user's trip
    if log_entry.trip.user != user:
        return Response({"error": "Unauthorized to update this log entry"}, status=status.HTTP_403_FORBIDDEN)

    # Check if 'end_time' is in the request data
    if "end_time" not in request.data:
        return Response({"error": "Only 'end_time' can be updated"}, status=status.HTTP_400_BAD_REQUEST)

    log_entry.end_time = request.data["end_time"]
    log_entry.save()

    return Response({"message": "Log entry updated", "log": LogEntrySerializer(log_entry).data}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_and_update_status(request):
    user = request.user
    data = request.data
    trip_id = data.get("trip")

    if not trip_id:
        return Response({"error": "Trip ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        trip = Trip.objects.get(id=trip_id, user=user)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

    last_log = LogEntry.objects.filter(trip=trip).order_by("-start_time").first()

    # Round lat/lng values if they exist
    if "location_lat" in data:
        data["location_lat"] = round(float(data["location_lat"]), 8)
    if "location_lng" in data:
        data["location_lng"] = round(float(data["location_lng"]), 8)

    with transaction.atomic():
        # Update last log entry if it exists
        if last_log:
            log_update_serializer = LogEntrySerializer(last_log, data={"end_time": data["start_time"]}, partial=True)
            if log_update_serializer.is_valid():
                log_update_serializer.save()
            else:
                return Response(log_update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create new log entry
        log_serializer = LogEntrySerializer(data=data)
        if log_serializer.is_valid():
            new_log = log_serializer.save()
        else:
            return Response(log_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update user status
        user_status = UserStatus.objects.get(user=user)
        status_serializer = UserStatusSerializer(user_status, data={"status": data["activity"], "trip": trip_id}, partial=True)
        if status_serializer.is_valid():
            new_status = status_serializer.save()
        else:
            return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "message": "Log entry created and status updated",
        "log": LogEntrySerializer(new_log).data,
        "user_status": UserStatusSerializer(new_status).data
    }, status=status.HTTP_201_CREATED)




