"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.views.generic import TemplateView

# from rest_framework import routers
# from users.views import views
# router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    # url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api/v1/', include('project.urls')),
    path('api/v1/', include('users.urls')),
    url(r'^.*', TemplateView.as_view(template_name="index.html"), name="home")
    # path('api/v1/', include(router.urls)),
    # url(r'^rest-auth/registration/account-confirm-email/ (?P[-:\w]+)/$',
    # TemplateView.as_view(), name="account_confirm_email"), 
]

from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)   
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

