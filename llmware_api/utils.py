from dotenv import load_dotenv
load_dotenv()
import os
from PyPDF2 import PdfReader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader, UnstructuredFileLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains import create_retrieval_chain
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.messages import HumanMessage, AIMessage
from langchain.indexes import VectorstoreIndexCreator
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from io import BytesIO

def get_text_from_file(file_path):
    raw_text = ""
    pdf_reader = PdfReader(file_path)
    for i,page in enumerate(pdf_reader.pages):
        content = page.extract_text()
        if content:
            raw_text += content
    raw_text += '\n'
    # loader = WebBaseLoader(file_path)
    # loader = PyPDFLoader(file_path)
    # docs = loader.load()
    text_splitter = CharacterTextSplitter(
        separator = "\n",
        chunk_size = 400,
        chunk_overlap  = 20,
        length_function = len,
    )
    texts = text_splitter.split_text(raw_text)
    
    # splitter = RecursiveCharacterTextSplitter(
    #     chunk_size=400,
    #     chunk_overlap=20
    # )
    # splitDocs = splitter.split_documents(docs)
    return texts

def split_docs(file_path):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=20
    )
    splitDocs = splitter.split_documents(docs)
    print(splitDocs)
    return splitDocs


def create_db(docs, local_path):
    embedding = OpenAIEmbeddings()
    vectorStore = FAISS.from_texts(docs, embedding=embedding)
    vectorStore.save_local(local_path)
    return vectorStore

def create_db_2(file_path, subject=""):
    if file_path.endswith('.txt') or file_path.endswith(".md"):
        loader = TextLoader(file_path)
    elif file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith('.docx'):
        loader = Docx2txtLoader(file_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=20
    )
    print("4")
    splitDocs = splitter.split_documents(docs)
    print(splitDocs)
    embedding = OpenAIEmbeddings()
    try:
        vectorStore = FAISS.load_local(f"faiss_index/{subject}", embedding, allow_dangerous_deserialization=True)
        vectorStore.add_documents(splitDocs)
        vectorStore.save_local(f"faiss_index/{subject}")
    except:
        vectorStore = FAISS.from_documents(splitDocs, embedding=embedding)
        # vectorStore = FAISS.from_documents(splitDocs, embedding=embedding)
        vectorStore.save_local(f"faiss_index/{subject}")
    print(vectorStore)
    return vectorStore


def create_chain(vectorStore, default_prommpt, human_prompt):
    model = ChatOpenAI(
        model="gpt-3.5-turbo-1106",
        temperature=0.4
    )
    # Answer the user's questions only in Hindi based on the context.

    prompt = ChatPromptTemplate.from_messages([
        ("system", default_prommpt+" {context}. Don't answer if question not related to the context, Just say I don't know instead."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
    ])


    # chain = prompt | model
    chain = create_stuff_documents_chain(
        llm=model,
        prompt=prompt
    )

    retriever = vectorStore.as_retriever(search_kwargs={"k": 3})

    retriever_prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        ("human", human_prompt)
    ])

    print(retriever_prompt)

    history_aware_retriever = create_history_aware_retriever(
        llm=model,
        retriever=retriever,
        prompt=retriever_prompt
    )

    retrieval_chain = create_retrieval_chain(
        # retriever,
        history_aware_retriever,
        chain
    )

    return retrieval_chain

def process_chat(chain, question, chat_history):
    response = chain.invoke({
        "input": question,
        "chat_history": chat_history
    })
    print(f"response - {response}")
    return response["answer"]

if __name__ == '__main__':
    # docs = get_text_from_file('media/docs/jefp109.pdf')
    # print(docs)
    # vectorStore = create_db(docs, 'faiss_index/hindi')
    # embedding = OpenAIEmbeddings()
    # vectorStore = FAISS.load_local('faiss_index/english', embedding, allow_dangerous_deserialization=True)
    # chain = create_chain(vectorStore)

    # chat_history = []

    # while True:
    #     # print(chat_history)
    #     # print('\n\n')
    #     user_input = input("You: ")
    #     if user_input.lower() == 'exit':
    #         break

    #     response = process_chat(chain, user_input, chat_history)
    #     chat_history.append(HumanMessage(content=user_input))
    #     chat_history.append(AIMessage(content=response))

    #     print("Assistant:", response)

    create_db_2('./test_hindi.txt', "hindi")