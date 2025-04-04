from django.urls import path, include
from .views.main_view import index
from .views.user_status_view import get_trip_logs, generate_eld_logs, user_status_view
from .views.auth_views import signup, login
from .views.trip_view import create_trip, get_trip_by_id, get_trips_by_user
from .views.theme_view import theme_view
from .views.log_view import create_log_entry, update_log_entry, log_and_update_status
from .views.compliance_view import generate_compliance_log
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('', index, name="index"),

    # User
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/user-status/", user_status_view, name="user_status"),

    # Trip
    path("api/trip/", create_trip, name="create_trip"),
    path("api/trip/<int:trip_id>/", get_trip_by_id, name="get_trip_by_id"),
    path("api/trip/mytrips/", get_trips_by_user, name="get_trips_by_user"),

    # Theme
    path("api/theme/", theme_view, name="theme_view"),

    # LogEntry
    path("api/log/", create_log_entry, name="create_log_entry"),
    path("api/log/<int:log_id>/", update_log_entry, name="update_log_entry"),
    path("api/log-and-update-status/", log_and_update_status, name="log_and_update_status"),

    # Compliance
    path("api/generate-compliance-log/<int:trip_id>/", generate_compliance_log, name="generate_compliance_log"),


]
