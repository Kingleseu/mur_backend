from django.urls import path
from . import views_web

app_name = 'wall'

urlpatterns = [
    path('', views_web.home, name='home'),
    path('testimony/new/', views_web.create_testimony, name='create_testimony'),
    path('testimony/<int:pk>/', views_web.testimony_detail, name='testimony_detail'),
    # Auth (OTP)
    path('auth/start/', views_web.auth_start, name='auth_start'),
    path('auth/verify/', views_web.auth_verify, name='auth_verify'),
    path('auth/status/', views_web.auth_status, name='auth_status'),
    path('auth/logout/', views_web.auth_logout, name='auth_logout'),
]
