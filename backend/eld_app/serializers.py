from rest_framework import serializers
from .models import Trip, LogEntry, UserStatus, Theme

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

class UserStatusSerializer(serializers.ModelSerializer):
    trip = serializers.PrimaryKeyRelatedField(queryset=Trip.objects.all(), allow_null=True, required=False)
    class Meta:
        model = UserStatus
        fields = ["status", "trip"]

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["dark_mode"]



