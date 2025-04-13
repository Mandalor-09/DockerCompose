import os
from dotenv import load_dotenv

# Load environment variables from .env file located at the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # Point to todo-app-docker/
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=dotenv_path)

# Add this import near the top if it's not already there
import os # Usually already present for BASE_DIR

# ... other settings like BASE_DIR, SECRET_KEY, DEBUG, INSTALLED_APPS ...

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': [], # You can leave this empty or point to a project-level templates dir if you have one
        # Make sure 'APP_DIRS' is True so Django finds templates inside apps (like the admin app)
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                # 'request' context processor is required by the admin
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'project.urls' # Tells Django where the main urls.py is

WSGI_APPLICATION = 'project.wsgi.application'

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-replace-me-in-production')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

# SECURITY WARNING: Update this in production!
ALLOWED_HOSTS = ['*'] # Allows access from Docker network and host

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken', # For token authentication
    'corsheaders',
    'drf_yasg', # Optional Swagger UI
    # Your apps
    'app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Must be high up
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ... other settings like ROOT_URLCONF, TEMPLATES, WSGI_APPLICATION ...

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('MYSQL_DATABASE'),
        'USER': os.environ.get('MYSQL_USER'),
        'PASSWORD': os.environ.get('MYSQL_PASSWORD'),
        'HOST': os.environ.get('MYSQL_HOST'), # <-- MUST read the env variable
        'PORT': os.environ.get('MYSQL_PORT', '3306'),
         'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
         }
    }
}

# Password validation
# ... AUTH_PASSWORD_VALIDATORS ...

# Internationalization
# ... LANGUAGE_CODE, TIME_ZONE, USE_I18N, USE_TZ ...

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
# Add this if you plan to serve static files via Django (less common for APIs)
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication', # Use Token auth
         # SessionAuthentication is useful for Browsable API
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly', # Allow read for anyone, write for logged in
    ]
}

# CORS Settings - Allow frontend origin
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # React default dev port
    "http://127.0.0.1:3000",
]
# Or for more permissive development:
# CORS_ALLOW_ALL_ORIGINS = True

# Authentication Backend
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)