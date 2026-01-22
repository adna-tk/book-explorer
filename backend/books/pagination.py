from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BookPageNumberPagination(PageNumberPagination):
    """
    Custom pagination class for books API.
    Returns paginated results with metadata.
    """
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        """
        Return a paginated style Response object with custom metadata.
        """
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page_size': self.page_size,
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })
