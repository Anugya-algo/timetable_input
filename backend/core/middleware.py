"""
Clerk Authentication Middleware
Verifies JWT tokens from Clerk and attaches user/department info to requests.
"""


class ClerkMiddleware:
    """
    Middleware to handle Clerk JWT verification.
    For now, this is a pass-through for development.
    In production, it should verify the Clerk JWT.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # For development, skip JWT verification
        # In production, verify Clerk JWT here
        response = self.get_response(request)
        return response
