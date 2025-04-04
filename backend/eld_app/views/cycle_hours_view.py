from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import LogEntry

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_total_on_duty_hours_8_days(request):
    # Calculate the date 8 days ago from now
    eight_days_ago = timezone.now() - timedelta(days=8)

    # Fetch log entries for Driving and On Duty (not driving) within the last 8 days
    logs = LogEntry.objects.filter(
        trip__user=request.user,
        status__in=["Driving", "On Duty (not driving)"],
        start_time__gte=eight_days_ago
    )

    # Sum total on-duty time in hours
    total_on_duty_hours = sum(
        (log.end_time - log.start_time).total_seconds() / 3600 for log in logs
    )

    return Response({
        "total_on_duty_hours_last_8_days": round(total_on_duty_hours, 2)
    })
