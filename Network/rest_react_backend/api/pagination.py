from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CommentPagination(PageNumberPagination):
    page_size = 3  # Number of comments per page
    page_size_query_param = 'page_size'
    max_page_size = 10  # Maximum number of comments per page

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data
        })
