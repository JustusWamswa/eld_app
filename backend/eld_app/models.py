from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_location_name = models.TextField(default='')
    current_location_lat = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    current_location_lng = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    pickup_location_name = models.TextField(default='')
    pickup_location_lat = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    pickup_location_lng = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    dropoff_location_name = models.TextField(default='')
    dropoff_location_lat = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    dropoff_location_lng = models.DecimalField(max_digits=12, decimal_places=8, default=0)
    distance_from_current_pickup = models.PositiveIntegerField(default=0)
    distance_from_pickup_dropoff = models.PositiveIntegerField(default=0)
    duration_from_current_pickup = models.PositiveIntegerField(default=0)
    duration_from_pickup_dropoff = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} - {self.user.username}"

class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    status = models.CharField(max_length=50, choices=[
        ('Driving', 'Driving'),
        ('On Duty (not driving)', 'On Duty (not driving)'),
        ('Off Duty', 'Off Duty'),
        ('Sleeper Berth', 'Sleeper Berth')
    ])
    location_name = models.TextField(blank=True, null=True)
    location_lat = models.DecimalField(max_digits=12, decimal_places=8)
    location_lng = models.DecimalField(max_digits=12, decimal_places=8)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    activity = models.TextField(blank=True, null=True)
    route_distance_from_start_point = models.PositiveIntegerField(default=0)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log Entry for Trip {self.trip.id} at {self.created_at}"
    
class UserStatus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.TextField(blank=True, null=True)
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User status {self.id} at {self.timestamp}"
    
class Theme(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dark_mode = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Theme: {self.dark_mode}"
    
    