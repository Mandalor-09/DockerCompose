from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from .models import Todo
from .serializers import TodoSerializer, UserSerializer

# --- Authentication Views ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Anyone can register
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'token': token.key, 'user_id': user.pk, 'username': user.username},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                       context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

class LogoutView(APIView):
     permission_classes = (permissions.IsAuthenticated,) # Must be logged in to logout

     def post(self, request, format=None):
         # Simply delete the token to force a login
         try:
             request.user.auth_token.delete()
         except (AttributeError, Token.DoesNotExist):
             pass # No token or already deleted, ignore
         return Response(status=status.HTTP_204_NO_CONTENT)


# --- Todo Views ---

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users

    def get_queryset(self):
        """
        This view should return a list of all the todos
        for the currently authenticated user.
        """
        return self.request.user.todos.all().order_by('-created_at')

    def perform_create(self, serializer):
        """
        Associate the todo with the logged-in user.
        """
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        # Optionally add checks here if needed, e.g. prevent changing owner
        serializer.save()

    def perform_destroy(self, instance):
        # Optionally add checks here
        instance.delete()