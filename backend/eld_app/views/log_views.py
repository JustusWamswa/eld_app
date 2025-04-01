from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import LogEntry, Trip
from ..serializers import LogEntrySerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_log_entry(request):
    user = request.user
    serializer = LogEntrySerializer(data=request.data)

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


