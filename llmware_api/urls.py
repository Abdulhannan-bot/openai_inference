from django.urls import path

from . import views

urlpatterns = [
    # path('',views.home, name="home"),
    # path('chat',views.prompt_with_sources_basic, name="chat"),
    path('chat_open_ai', views.open_ai_chat, name="chat_open_ai"),
    path('open_ai_chain', views.open_ai_chain, name="chat_ai_chain"),
    path('random-text', views.get_random_text, name='random_text'),
    # path('documents', views.add_documents, name="documents"),
    path('login', views.login_user, name="login_user"),
]