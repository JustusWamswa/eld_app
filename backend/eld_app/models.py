from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    current_cycle_used = models.FloatField(help_text="Hours used in the current cycle")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} - {self.user.username}"

class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[
        ('Driving', 'Driving'),
        ('On Duty (not driving)', 'On Duty (not driving)'),
        ('Off Duty', 'Off Duty'),
        ('Sleeping', 'Sleeping')
    ])
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Log Entry for Trip {self.trip.id} at {self.timestamp}"