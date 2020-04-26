from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .forms import UploadFileForm
from .lib.extract import get_sound
from django.shortcuts import render
from typing import List


def index(request: HttpRequest) -> HttpResponse:
    """
    Servers the react app
    """
    return render(request, "build/index.html")


@csrf_exempt
def extract(request: HttpRequest) -> HttpResponse:
    """
    Takes a pptx file and sends the extracted audio as a POST request
    """
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                sound_file = get_sound(request.FILES['file'])
                return create_download_response(sound_file)
            except Exception:
                response = HttpResponse()
                response.status_code = 400
                response.content = 'No sound in file'
                return response

    return create_invalid_method('POST')


def create_invalid_method(valid_methods: List[str]) -> HttpResponse:
    """
    :param valid_methods: valid HTTP methods supported by the route
    :return: 404 HttpResponse and the valid methods that can be used with that route
    """
    response = HttpResponse()
    response.content = 'Method not allowed'
    response['Allow'] = ' '.join(valid_methods)
    response.status_code = 405
    return response


def create_download_response(file) -> HttpResponse:
    """
    Creates the response consumed by the /extract route
    :param file: extracted sound file (wav format)
    :return: HttpResponse with the sound file in Content-Disposition
    """
    response = HttpResponse()
    response['Content-Disposition'] = 'attachment; filename="{}"'.format(file)
    response.status_code = 201
    response.content = str(file).split('/')[-1]
    return response
