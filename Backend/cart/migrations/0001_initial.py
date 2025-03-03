# Generated by Django 5.1 on 2024-09-09 01:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('product', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('create_time', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('P', 'Pending'), ('C', 'Cenceled'), ('O', 'Ordered')], default='P', max_length=1)),
                ('PID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.product', verbose_name='product ID')),
                ('UID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user', verbose_name='user ID')),
            ],
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.product', verbose_name='product ID')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user', verbose_name='user ID')),
            ],
        ),
    ]
