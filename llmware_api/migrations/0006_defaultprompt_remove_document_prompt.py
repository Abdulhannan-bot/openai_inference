# Generated by Django 5.0.3 on 2024-04-29 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llmware_api', '0005_document_prompt'),
    ]

    operations = [
        migrations.CreateModel(
            name='DefaultPrompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(choices=[('english', 'English'), ('hindi', 'Hindi'), ('mathematics', 'Mathematics'), ('science', 'Science'), ('social_science', 'Social Science')], max_length=100, null=True, unique=True)),
                ('prompt', models.TextField(null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='document',
            name='prompt',
        ),
    ]
