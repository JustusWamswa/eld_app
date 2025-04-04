from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Trip, UserStatus
from ..serializers import UserStatusSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_status_view(request):
    user = request.user

    # Get or create a UserStatus for this user
    user_status, created = UserStatus.objects.get_or_create(user=user, defaults={"status": ""})

    if request.method == "GET":
        serializer = UserStatusSerializer(user_status)
        return Response(serializer.data)

    elif request.method == "POST":
        trip_id = request.data.get("trip")  # Get the trip ID from request data

        # If a trip ID is provided, update the trip field
        if trip_id:
            try:
                trip = Trip.objects.get(id=trip_id, user=user)  # Ensure trip belongs to the user
                user_status.trip = trip
            except Trip.DoesNotExist:
                return Response({"error": "Invalid trip ID"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserStatusSerializer(user_status, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Status updated",
                "status": serializer.data["status"],
                "trip": serializer.data.get("trip")  # Include updated trip info
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
