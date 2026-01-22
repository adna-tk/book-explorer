from django.db import migrations
from django.contrib.auth import get_user_model


def create_test_users(apps, schema_editor):
    User = get_user_model()
    
    user1, created1 = User.objects.get_or_create(
        username='john.doe@mail.com',
        defaults={
            'email': 'john.doe@mail.com',
            'first_name': 'John',
            'last_name': 'Doe',
        }
    )
    if created1:
        user1.set_password('JohnDoe123')
        user1.save()
    
    user2, created2 = User.objects.get_or_create(
        username='jane.doe@mail.com',
        defaults={
            'email': 'jane.doe@mail.com',
            'first_name': 'Jane',
            'last_name': 'Doe',
        }
    )
    if created2:
        user2.set_password('JaneJane123')
        user2.save()


def remove_test_users(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(
        username__in=['john.doe@mail.com', 'jane.doe@mail.com']
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RunPython(create_test_users, remove_test_users),
    ]
