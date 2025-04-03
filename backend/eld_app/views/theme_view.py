from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Theme
from ..serializers import ThemeSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def theme_view(request):
    user = request.user

    # Get or create a Theme instance for the user
    theme, created = Theme.objects.get_or_create(user=user)

    if request.method == "GET":
        serializer = ThemeSerializer(theme)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ThemeSerializer(theme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Theme updated", "dark_mode": serializer.data["dark_mode"]})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
