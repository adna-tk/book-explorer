from rest_framework import serializers
from datetime import datetime
from .models import Book, UserNote

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

    def validate_published_year(self, value):
        """Validate published_year is within reasonable range"""
        if value is not None:
            current_year = datetime.now().year
            if value < 0:
                raise serializers.ValidationError("Published year cannot be negative.")
            if value > current_year + 1:
                raise serializers.ValidationError(
                    f"Published year cannot be more than {current_year + 1} (for pre-orders)."
                )
        return value

    def validate_title(self, value):
        """Validate title is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def validate_author(self, value):
        """Validate author is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Author cannot be empty.")
        return value.strip()


class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id', 'book', 'note', 'created_at', 'updated_at']
        read_only_fields = ['id', 'book', 'created_at', 'updated_at']
        extra_kwargs = {
            'book': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
