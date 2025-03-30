from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, LogEntryViewSet, get_trip_logs, generate_eld_logs, index, user_status_view
from .auth_views import signup, login
from rest_framework_simplejwt.views import TokenRefreshView


router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logs', LogEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', index, name="index"),
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/user-status/", user_status_view, name="user-status"),
    path('api/trips/<int:trip_id>/logs/', get_trip_logs, name='trip-logs'),
    path('api/trips/<int:trip_id>/eld-logs/', generate_eld_logs, name='generate-eld-logs'),
]
