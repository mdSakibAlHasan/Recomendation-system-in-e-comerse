# Generated by Django 5.1 on 2024-12-12 09:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(verbose_name='Notification message')),
                ('link', models.URLField(blank=True, max_length=500, null=True, verbose_name='Redirection link')),
                ('is_read', models.BooleanField(default=False, verbose_name='status')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Sending time')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='user ID')),
            ],
        ),
    ]
