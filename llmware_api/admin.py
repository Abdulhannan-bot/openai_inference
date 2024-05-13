from django.contrib import admin
from .models import Document, ChatResponse, TextRandom, User, DefaultPrompt, Subject
from django.utils.translation import gettext_lazy as _
# Register your models here.

class DocumentAdmin(admin.ModelAdmin):
    list_display = ["id","doc", "selected"]

admin.site.register(Document, DocumentAdmin)

class ChatResponseAdmin(admin.ModelAdmin):
    list_display = ["id"]

admin.site.register(ChatResponse, ChatResponseAdmin)

class TextRandomAdmin(admin.ModelAdmin):
    list_display = ["id", "text"]

admin.site.register(TextRandom, TextRandomAdmin)

class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (_("User Credentials"), {'fields': ('email', 'first_name', 'last_name')}),
    )

    list_display = (
        'email',
        'first_name',
        'last_name',
    )

admin.site.register(User, UserAdmin)

class DefaultPromptAdmin(admin.ModelAdmin):
    list_diplay = ["subject", "prompt"]

admin.site.register(DefaultPrompt, DefaultPromptAdmin)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name"]

admin.site.register(Subject, SubjectAdmin)