import json
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import ChatResponse, TextRandom, User, DefaultPrompt
from .utils import create_chain, process_chat
from django.http import JsonResponse
from langchain_core.messages import HumanMessage, AIMessage
# Create your views here.
import os

import random
# from llmware.prompts import Prompt
# from llmware.setup import Setup
# from llmware.models import PromptCatalog
from pathlib import Path
from django.conf import settings
from PyPDF2 import PdfReader
from langchain_community.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
# from langchain.document_loaders import PyPDFLoader
from langchain.indexes import VectorstoreIndexCreator
from typing_extensions import Concatenate
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI

llm_name="TheBloke/Llama-2-7B-Chat-GGUF"
# llm_name="llmware/slim-tags-3b-tool"
api_key = "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"
model_name="TheBloke/Llama-2-7B-Chat-GGUF"

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def home(request):
#     # body = json.loads(request.body)
#     # prompt = body.get("prompt")
#     prompt = request.data.get("prompt")
#     prompter = Prompt(llm_name=llm_name, llm_api_key=api_key)
#     history = ChatResponse.objects.all().order_by("-id")[:5]
#     context = ""
#     for record in history:
#         context += f"""[INST]
#         <<SYS>>You are a helpful assistant. Answer like Neil De Grasse Tyson.<</SYS>>
#         {record.chat.get("prompt")}
#         [/INST]
#         {record.chat.get("response")}
#         """
#     prompt = f"""[INST]
#     <<SYS>>You are a helpful assistant. Answer like Neil De Grasse Tyson.<</SYS>>
#     {prompt}
#     [/INST]
#     """
#     response = prompter.prompt_main(prompt=prompt, context=context)["llm_response"]
#     print (f"- Context: {context}\n- Prompt: {prompt}\n- LLM Response:\n{response}")
#     new_chat = ChatResponse.objects.create(chat={"prompt": prompt, "response": response})
#     new_chat.save()

#     return Response({'success':True, 'data': {'prompt': new_chat.chat.get("prompt"), 'response': new_chat.chat.get("response")}})


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def prompt_with_sources_basic(request):
#     body = request.data
#     prompt = body.get("prompt")
#     file = body.get("file")
#     fp = os.path.join(settings.BASE_DIR, "media/docs")

#     local_file = file

#     prompter = Prompt().load_model(model_name)

#     prompt_history = """"""
#     history = ChatResponse.objects.all().order_by("-id")[:5]

    

#     #   .add_source_document will do the following:
#     #       1.  parse the file (any supported document type)
#     #       2.  apply an optional query filter to reduce the text chunks to only those matching the query
#     #       3.  batch according to the model context window, and make available for any future inferences

#     sources = prompter.add_source_document(fp, local_file)
#     # [INST]<<SYS>>Answer like a Professor. If Answer not in context say I dont know.<</SYS>>What is IPO?[/INST]
#     for record in history:
#         prompt_history += f"""
#             [INST]<<SYS>>You are a helpful assistant. Answer Like a Professor.<</SYS>>{record.chat.get("prompt")}[/INST]
#             {record.chat.get("response")}
#         """
    
#     # prompt = """
#     #   [INST]<<SYS>>Answer like a Teacher.<</SYS>>Did they seagull fly at last?[/INST]
#     #   Yes, the young seagull did fly at last after overcoming his initial fear and with the help of his mother. After diving into space and experiencing a moment of terror, he felt his wings spread outwards and managed to fly away. This marks a significant milestone in the young seagull's life as he learns to overcome his fears and take to the skies, just like his siblings and parents.
#     #   [INST]<<SYS>>Answer like a Teacher.<</SYS>>Could elaborate how the author described it?[/INST]
#     # """
#     full_prompt = prompt_history + f"""[INST]<<SYS>You are a helpful assistant. Answer Like a Professor.<</SYS>>{prompt}[/INST]"""
#     prompt_instruction = "facts_only"
#     response = prompter.prompt_with_source(prompt=full_prompt, prompt_name=prompt_instruction)

#     print(f"LLM Response - {response}")

#     response_display = response[0]["llm_response"]
#     print (f"- Context: {local_file}\n- Prompt: {full_prompt}\n- LLM Response:\n{response_display}")
#     prompter.clear_source_materials()
#     new_chat = ChatResponse.objects.create(chat={"prompt": prompt, "response": response_display})
#     new_chat.save()
#     return Response({'success':True, 'response': response_display, 'source': local_file})

    
@api_view(['POST'])
@permission_classes([AllowAny])
def get_random_text(request):
    print(request.body)
    # Get the count of records in the TextRandom model
    text_count = TextRandom.objects.count()
    
    # Generate a random number between 0 and text_count - 1
    random_index = random.randint(0, text_count - 1)
    
    # Retrieve the corresponding text using the random index
    random_text = TextRandom.objects.all()[random_index].text
    
    # Return the random text as JSON response
    # return JsonResponse({'random_text': random_text})
    return Response({'success':True, 'response': random_text})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    body = request.data
    print(body)
    email = body.get('email')
    first_name = body.get("firstName")
    last_name = body.get("lastName")
    try:
        user = User.objects.get(email=email)
        
    except:
        create_query = {
            'email': email,
            'first_name': first_name,
            'last_name': last_name
        }
        user = User.objects.create(**create_query)
        user.save()

    return Response({'success': True, 'msg': 'logged In successfully', 'name': f"{first_name} {last_name}", 'email': str(user.email)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teacher_avatar(request):
    return Response({'success': True, 'msg': 'There is an impending case'})

@api_view(['POST'])
@permission_classes([AllowAny])
def open_ai_chat(request):
    body = request.data
    prompt = body.get("prompt")
    embeddings = OpenAIEmbeddings()

    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    chain = load_qa_chain(OpenAI(), chain_type="stuff")

    prompt_history = """"""
    history = ChatResponse.objects.all().order_by("-id")

    for record in history:
        prompt_history += f"""
            [INST]
            <<SYS>>उत्तर केवल हिंदी में दें<</SYS>>
            {record.chat.get("prompt")}
            [/INST]
            {record.chat.get("response")}
        """

    query = prompt_history + f"""
    [INST]
    <<SYS>>उत्तर केवल हिंदी में दें<</SYS>>
    {prompt}
    [/INST]
    """

    print(query)

    docs = new_db.similarity_search(query)
    value = chain.run(input_documents=docs, question=query)

    new_chat = ChatResponse.objects.create(chat={"prompt": prompt, "response": value})
    new_chat.save()

    return Response({'success':True, 'response': value, 'source': docs})

@api_view(['POST'])
@permission_classes([AllowAny])
def open_ai_chat(request):
    body = request.data
    prompt = body.get("prompt")
    session_id = body.get("sessionId")
    subject = body.get("subject")
    print(subject)
    # session_names = [session_id]

    embeddings = OpenAIEmbeddings()

    new_db = FAISS.load_local(f"faiss_index/english", embeddings, allow_dangerous_deserialization=True)
    chain = load_qa_chain(OpenAI(), chain_type="stuff")

    prompt_history = """"""
    history = None
    
    history = ChatResponse.objects.all()

    for record in history:
        prompt_history += f"""
            [INST]
            <<SYS>>You are a helpful assistant. Answer only from the embedded documents. Dont try to make answers up.<</SYS>>
            {record.chat.get("prompt")}
            [/INST]
            {record.chat.get("response")}
        """
    

    query = prompt_history + f"""
    [INST]
    <<SYS>>You are a helpful assistant. Answer only from the embedded documents. Dont try to make answers up.<</SYS>>
    {prompt}
    [/INST]
    """

    # print(query)

    docs = new_db.similarity_search(query)
    print(docs)
    value = chain.run(input_documents=docs, question=query)

    new_chat = ChatResponse.objects.create(chat={"prompt": prompt, "response": value})
    new_chat.save()

    return Response({'success':True, 'response': value, 'source': docs})


@api_view(['POST'])
@permission_classes([AllowAny])
def open_ai_chain(request):
    body = request.data
    prompt = body.get("prompt")
    subject = body.get("subject")
    embeddings = OpenAIEmbeddings()

    default_prompt = DefaultPrompt.objects.get(subject=subject)

    print(default_prompt.prompt)

    new_db = FAISS.load_local(f"faiss_index/{subject}", embeddings, allow_dangerous_deserialization=True)

    history = ChatResponse.objects.filter(subject = subject)

    chat_history = []

    for record in history:
        chat_history.append(HumanMessage(content=record.chat.get("prompt")))
        chat_history.append(AIMessage(content=record.chat.get("response")))


    
    docs = new_db.similarity_search(prompt)
    print(docs)
    
    chain = create_chain(new_db, default_prompt.prompt, default_prompt.human_prompt)
    response = process_chat(chain, prompt, chat_history)

    new_chat = ChatResponse.objects.create(chat={"prompt": prompt, "response": response})
    new_chat.save()

    return Response({'success':True, 'response': response, 'source': docs})

