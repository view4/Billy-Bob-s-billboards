# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-08-01 11:13
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('socialboard', '0006_comments_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comments',
            name='post',
        ),
        migrations.DeleteModel(
            name='Comments',
        ),
    ]