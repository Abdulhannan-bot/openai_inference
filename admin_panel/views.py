from django.shortcuts import render, redirect
from django.http import HttpResponse
from llmware_api.models import Document, DefaultPrompt, Subject
import os
from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.indexes import VectorstoreIndexCreator
from typing_extensions import Concatenate
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI
from llmware_api.utils import create_db, get_text_from_file, create_db_2
from llmware_api.authenticate import EmailBackend
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .utility import extract_text_from_pdf
import pytesseract
from pdf2image import convert_from_path
import shutil
from django.contrib import messages


# Create your views here.

def login_user(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email,password=password)
        if not user:
            messages.error(request, 'Invalid Credentials')
            return render(request, 'login.html')
        login(request, user)
        return redirect('home')
    return render(request, 'login.html')

@login_required(login_url="login")
def home(request):
    user = request.user

    subjects = Subject.objects.all()
    return render(request, 'home.html', context = {'subjects': subjects, 'user': user})

@login_required(login_url="login")
def add_subjects(request):
    subject_name = request.POST.get("subject_name")
    new_subject = Subject.objects.create(name = subject_name)
    new_subject.save()
    return redirect('home')

@login_required(login_url="login")
def delete_subject(request):
    subject_id = request.POST.get("subject_id")
    subject = Subject.objects.get(id = subject_id)
    folder_path = f"faiss_index/{subject.name}"
    try:
        shutil.rmtree(folder_path)
        print(f"Folder '{folder_path}' deleted successfully.")
    except OSError as e:
        print(f"Error: {folder_path} : {e.strerror}")
    subject.delete()

    return redirect('home')
    
@login_required(login_url="login")
def add_documents(request,subject):
    try:
        subject_current = Subject.objects.get(name = subject)
    except:
        return HttpResponse('<div>Page Not Found</div>')
    subjects_list = Subject.objects.all()
    if subject == "" or subject is None:
        return HttpResponse("<h1>Error</h1>")
    docs = Document.objects.filter(subject = subject_current)
    for i in docs:
        print(i)
    try:
        prompt = DefaultPrompt.objects.get(subject = subject_current)
    except DefaultPrompt.DoesNotExist:
        prompt = DefaultPrompt.objects.create(subject = subject_current)
    
    if request.method == "POST":
        if 'delete' in request.POST:
            print(request.POST)
            doc_id = request.POST.get("document_id")
            doc_name = request.POST.get("document_name")
            embeddings = OpenAIEmbeddings()
            vector = FAISS.load_local(f"faiss_index/{subject}", embeddings, allow_dangerous_deserialization=True)
            ids = []
            for item in vector.docstore._dict.items():
                metadata = item[1].metadata
                source = metadata['source']
                print(source)
                if source == str(doc_name):
                    ids.append(item[0])      
            vector.delete(ids)
            vector.save_local(f"faiss_index/{subject_current.name}")
            del_doc = Document.objects.get(id = doc_id)
            del_doc.delete()
            return redirect('documents', subject=subject_current.name)
        

        if 'prompt-submit' in request.POST:
            this_prompt = request.POST.get("prompt")
            prompt.prompt = this_prompt
            prompt.save()
            return redirect('documents', subject=subject_current.name)
     

        this_docs = request.FILES.getlist("docs")
        for i in this_docs:
            new_doc = Document.objects.create(subject = subject_current.name, doc = i)
            create_db_2(str(new_doc.doc.file), subject_current.name)
            new_doc.save()
        return redirect('documents', subject=subject_current.name)
    
    return render(request, "documents.html", context = {'docs': docs, 'prompt': prompt, 'subjects': subjects_list, 'subject_current': subject_current.name})

@login_required(login_url="login")
def logout_user(request):
    logout(request)
    return redirect('login')