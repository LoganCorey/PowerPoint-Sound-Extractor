import unittest

from audio_extractor.lib.extract import *


class TestExtractMethods(unittest.TestCase):

    def test_sort_audio_by_number(self):
        unordered_audio = ['ppt/media/media3.wav', 'ppt/media/media1.wav', 'ppt/media/media2.wav']
        self.assertListEqual(sort_audio_by_number(unordered_audio),
                             ['ppt/media/media1.wav', 'ppt/media/media2.wav', 'ppt/media/media3.wav'])

    def test_resolve_file_type(self):
        self.assertEqual(resolve_file_type('/tmp/adsd23/media1.wav'), 'wav')

    def test_resolve_file_type_no_path(self):
        self.assertEqual(resolve_file_type('media1.wav'), 'wav')
