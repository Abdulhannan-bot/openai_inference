# Generated by Django 5.0.3 on 2024-05-13 03:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llmware_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='defaultprompt',
            name='prompt',
            field=models.TextField(default="Answer the user's questions based on the context.", null=True),
        ),
    ]
