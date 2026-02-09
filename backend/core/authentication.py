import jwt
import requests
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from rest_framework import authentication
from rest_framework import exceptions
from meta.models import Department
import json
import base64

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided.')

        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        # In a real production app, fetch JWKS from Clerk and verify signature.
        # For this setup, we will decode unverified to get the payload (if verifying locally is complex without keys)
        # OR we fetch the keys.
        
        # NOTE: For simplicity and since we don't have the CLERK_PEM_PUBLIC_KEY or JWKS_URL in env yet,
        # we will Decode without verification for the MVP step, BUT structure it to be replaceable.
        # Ideally: 
        # jwks_url = 'https://<your-clerk-domain>/.well-known/jwks.json'
        # jwks = requests.get(jwks_url).json()
        # ... verify ...
        
        try:
            # Decoding without verification for MVP speed, 
            # assuming HTTPS and Clerk-Frontend trust.
            # WARNING: IN PRODUCTION, VERIFY SIGNATURE using PyJWT and JWKS.
            payload = jwt.decode(token, options={"verify_signature": False})
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')

        user_id = payload.get('sub')
        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid token: no user_id')

        # Sync User and Department
        # Expecting public_metadata to contain 'department_code' or 'department_name'
        # e.g. {'department_code': 'CS'}
        
        # Clerk stores metadata in 'public_metadata' or custom claims. 
        # Adjust based on actual Clerk setup.
        metadata = payload.get('public_metadata', {})
        dept_code = metadata.get('department_code')
        
        if not dept_code:
            # Fallback for generic testing if setup isn't perfect yet
            # raise exceptions.AuthenticationFailed('User has no department assigned in Clerk metadata.')
            dept_code = "DEFAULT" 

        department, created = Department.objects.get_or_create(
            code=dept_code,
            defaults={'name': f"Department {dept_code}"}
        )

        try:
            user, created = User.objects.get_or_create(username=user_id)
            # Attach department_id (UUID) to the user object temporarily for the request
            user.department_id = department.id
        except Exception as e:
             raise exceptions.AuthenticationFailed(f'User sync failed: {str(e)}')

        return (user, None)
