from django.http import HttpResponse


def index(request):
    return HttpResponse("<h4 style='text-align:center; margin-top:50;'>ELD APP</h4>")