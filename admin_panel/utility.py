import pytesseract
from pdf2image import pdfinfo_from_path, convert_from_path


def extract_text_from_pdf(src):
    info = pdfinfo_from_path(src)
    max_pages = info.get("Pages")
    convert_text = ''
    for page_num in range(1,max_pages+1):
        images_123e = convert_from_path(src, fmt="jpg", first_page=page_num, last_page=page_num)
        for image in images_123e:
           convert_text += pytesseract.image_to_string(image, lang="hin")
    print(convert_text)
    
    return convert_text