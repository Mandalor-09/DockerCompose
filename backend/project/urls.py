from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view # Optional Swagger
from drf_yasg import openapi             # Optional Swagger
from rest_framework import permissions    # Optional Swagger

# Optional Swagger Schema View
schema_view = get_schema_view(
   openapi.Info(
      title="Todo API",
      default_version='v1',
      description="API for the Todo Application",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@todo.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')), # Include your app's urls
    # Optional: Swagger UI/Schema URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]