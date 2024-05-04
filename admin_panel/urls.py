from django.urls import path
from . import views

urlpatterns = [
    path('documents/<str:subject>', views.add_documents, name="documents"),
]