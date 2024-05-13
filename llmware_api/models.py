from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

# Create your models here.

SUBJECTS = (
    ('english', 'English'),
    ('hindi', 'Hindi'),
    ('mathematics', 'Mathematics'),
    ('science', 'Science'),
    ('social_science', 'Social Science'),
)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, first_name='',  last_name='', **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.first_name = first_name
        user.last_name = last_name
        user.is_verified = True
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(max_length=255, blank = True, null = True)
    last_name = models.CharField(max_length=255, blank = True, null = True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        if self.first_name:
            return f"{self.first_name} {self.last_name}"
        return str(self.id)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ('first_name',)
        verbose_name = "User"

# User.groups.field.related_name = 'llmware_user_groups'
# User.user_permissions.field.related_name = 'llmware_user_permissions'

class Subject(models.Model):
    name = models.CharField(max_length=255, null = True, unique=True)

    def __str__(this):
        return str(this.name)

class ChatResponse(models.Model):
    chat = models.JSONField(blank = True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, null = True, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=200, null = True)

class Document(models.Model):
    doc = models.FileField(upload_to='docs/')
    subject = models.ForeignKey(Subject, null = True, on_delete=models.CASCADE)
    # prompt = models.TextField(null = True)
    selected = models.BooleanField(default=True)

class DefaultPrompt(models.Model):
    subject = models.ForeignKey(Subject, null = True, on_delete=models.CASCADE)
    prompt = models.TextField(null = True)
    human_prompt = models.TextField(null = True)

    def __str__(this):
        return str(this.subject.name)

class TextRandom(models.Model):
    text = models.TextField(null = True)


