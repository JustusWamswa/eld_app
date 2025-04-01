from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def index(request):
    return Response("<h4 style='text-align:center; margin-top:50;'>ELD APP</h4>")