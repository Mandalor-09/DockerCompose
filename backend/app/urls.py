from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, RegisterView, LoginView, LogoutView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'), # Uses DRF's ObtainAuthToken
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('', include(router.urls)), # Include the router URLs for todos
]