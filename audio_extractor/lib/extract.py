"""
Contains function ued to extract sound from a pptx file.
The basic idea is to rename the pptx file to zip and explore the media contents and then concat all the files
using pydub
"""
from django.core.files.temp import NamedTemporaryFile
from django.core.files.uploadedfile import TemporaryUploadedFile
from typing import List
import zipfile
import mimetypes
import tempfile
import shutil
from os import path, listdir, remove
from pydub import AudioSegment


def get_sound(file: TemporaryUploadedFile) -> str:
    """
    Main function which combines all of the audio files from a pptx file
    :param file: uploaded file
    :return: the combined audio file's location
    """
    # read the file into a zip format to explore the pptx contents
    pptx_zip = create_temp_zip(file)
    dir_path = extract_files_from_zip(pptx_zip)
    # retrieve all the audio files
    audio_files = sort_audio_by_number(find_audio_files(dir_path))
    export_path = export_audio(audio_files)
    shutil.rmtree(dir_path)
    return export_path


def create_temp_zip(file: TemporaryUploadedFile) -> NamedTemporaryFile:
    """
    reads the uplaoded file into a temporary zip file
    which will later be used to extract the audio files from
    :param file: file uploaded by the user
    :return: the temporary zip file of the uploaded file
    """
    # renaming like this is ok since a pptx file is the hood a zip
    pptx_temp_file = NamedTemporaryFile(delete=False, suffix='.zip')
    with pptx_temp_file as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    pptx_zip = zipfile.ZipFile(pptx_temp_file.name)
    return pptx_zip


def extract_files_from_zip(pptx_zip: NamedTemporaryFile) -> tempfile:
    """
    extracts all the files from the zip of the uploaded file
    :param pptx_zip: zip file of the uploaded file
    :return: a temp directory which holds the extracted contents of the zip
    """
    temp_dir = tempfile.mkdtemp()
    pptx_zip.extractall(temp_dir)
    remove(pptx_zip.filename)
    return temp_dir


def export_audio(audio_files: List[str]) -> str:
    """
    Merges the audio files and exports the segment
    :param audio_files: a list of all the audio files paths (ordered from media(1), media(2)...media(n))
    :return: The path the audio segment was exported to
    """
    segment = generate_audio_file(audio_files)
    file_name = next(tempfile._get_candidate_names())
    export_path = "/tmp/{}.wav".format(file_name)
    segment.export(export_path, format="wav")
    return export_path


def find_audio_files(dir_path: str) -> List[str]:
    """
    Creates a list of the path of any audio files in the ppt/media folder
    :param dir_path:
    :return:
    """
    audio_files = []
    ppt_media_path = path.join(dir_path, 'ppt/media')

    for file in listdir(ppt_media_path):
        file_path = path.join(ppt_media_path, file)
        mime_type = mimetypes.guess_type(file_path)[0]
        # check mime type to confirm the file is an audio one and not an image or something
        if mime_type and mime_type.split('/')[0] == 'audio':
            audio_files.append(file_path)
    return audio_files


def sort_audio_by_number(audio_files: List[str]) -> List[str]:
    """
    Sorts the audio files based on the files number
    :param audio_files: a list of every audio file
    :return: the audio files sorted on their audio number (ex: media1.sound, media2.sound)
    """
    # since the file has the format path/media(n).sound we need to isolate the media(n).sound part
    # by splitting on the /, split on the . and then strip the first 5 characters so we are left with just the number
    return sorted(audio_files, key=lambda file: int(file.split('/')[-1].split('.')[0][5:]))


def resolve_file_type(audio_file: str) -> str:
    """
    Retrieves the file type given a file path
    :param audio_file: a files path ex: /tmp/ppt/media/media1.wav
    :return:  the file type
    """
    return path.splitext(audio_file)[1][1:]


def generate_audio_file(sorted_audio_files: List[str]) -> AudioSegment:
    """
    Merges all the audio files into one AudioSegment which will later be exported
    :param sorted_audio_files: all the audio files in
    :return:
    """
    file_type = resolve_file_type(sorted_audio_files[0])
    segment = None
    for audio_file in sorted_audio_files:
        if segment is None:
            segment = AudioSegment.from_file(audio_file, format=file_type)
        else:
            segment += AudioSegment.from_file(audio_file, format=file_type)
    return segment
