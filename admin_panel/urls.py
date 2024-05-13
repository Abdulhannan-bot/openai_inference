from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login_user, name="login"),
    path('', views.home, name="home"),
    path('add_subject', views.add_subjects, name="add_subject"),
    path('delete_subjecct', views.delete_subject, name="delete_subject"),
    path('subject/<str:subject>', views.add_documents, name="subject"),
    path('logout', views.logout_user, name="logout")
]