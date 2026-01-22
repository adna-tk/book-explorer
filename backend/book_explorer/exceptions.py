from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler to provide consistent error response format.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            'error': {
                'status_code': response.status_code,
                'message': response.data.get('detail', 'An error occurred'),
                'details': response.data if isinstance(response.data, dict) else {'non_field_errors': response.data}
            }
        }
        
        if 'detail' in custom_response_data['error']['details']:
            custom_response_data['error']['details'].pop('detail')
        
        response.data = custom_response_data

    return response
