from django.shortcuts import render, redirect
from llmware_api.models import Document, DefaultPrompt
import os
from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.indexes import VectorstoreIndexCreator
from typing_extensions import Concatenate
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI
from llmware_api.utils import create_db, get_text_from_file
from .utils import extract_text_from_pdf

# Create your views here.

def add_documents(request,subject):
    docs = Document.objects.filter(subject = subject)
    try:
        prompt = DefaultPrompt.objects.get(subject = subject)
    except DefaultPrompt.DoesNotExist:
        prompt = DefaultPrompt.objects.create(subject = subject)
    
    if request.method == "POST":
        print(request.POST)
        if 'delete' in request.POST:
            print(request.POST)
            doc_id = request.POST.get("document_id")
            del_doc = Document.objects.get(id = doc_id)
            del_doc.delete()
            print("it has been deleted")
            return redirect('documents', subject=subject)
        

        if 'embedd' in request.POST:
            print(request.POST)
            document_search = None
            raw_text = ''
            if docs.count() >= 1:
                for i in docs:
                    print(i.doc.file)
                    file_path = i.doc.file
                    if subject == "hindi":
                        print(file_path)
                        raw_text += extract_text_from_pdf(str(file_path))
                    else:
                        pdf_reader = PdfReader(file_path)
                        for i,page in enumerate(pdf_reader.pages):
                            content = page.extract_text()
                            if content:
                                raw_text += content
                    raw_text += '\n'
                print(raw_text)
                text_splitter = CharacterTextSplitter(
                    separator = "\n",
                    chunk_size = 800,
                    chunk_overlap  = 200,
                    length_function = len,
                )
                texts = text_splitter.split_text(raw_text)
                print(texts)

                embeddings = OpenAIEmbeddings()
                document_search = FAISS.from_texts(texts, embeddings)
                document_search.save_local(f"faiss_index/{subject}")
            return redirect('documents', subject=subject)
        
        if 'prompt-submit' in request.POST:
            print("hi")
            this_prompt = request.POST.get("prompt")
            prompt.prompt = this_prompt
            prompt.save()
            return redirect('documents', subject=subject)
     

        
        this_docs = request.FILES.getlist("docs")
        loaders = []
        for i in this_docs:
            print(i)
            new_doc = Document.objects.create(subject = subject, doc = i)
            new_doc.save()
        # all_docs = Document.objects.filter(subject=subject)


        return redirect('documents', subject=subject)
    
    # docs = Document.objects.filter(subject = subject)
    return render(request, "documents.html", context = {'docs': docs, 'prompt': prompt})
