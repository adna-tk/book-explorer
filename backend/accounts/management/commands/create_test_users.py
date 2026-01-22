from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates two test users for development'

    def handle(self, *args, **options):
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
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {user1.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'User {user1.username} already exists')
            )

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
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {user2.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'User {user2.username} already exists')
            )

        self.stdout.write(
            self.style.SUCCESS('\nTest users created successfully!')
        )
        self.stdout.write('Username: john.doe@mail.com, Password: JohnDoe123')
        self.stdout.write('Username: jane.doe@mail.com, Password: JaneJane123')
