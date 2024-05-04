import os
import PyPDF2
import pytesseract
from pdf2image import convert_from_path
import shutil

def extract_text_from_pdf(src):
    convert_text = ''
   
    images_123e = convert_from_path(src)
    for i in images_123e:
        convert_text += pytesseract.image_to_string(i, lang="Devanagari")
        print(convert_text)
    print(convert_text)
    
    return convert_text