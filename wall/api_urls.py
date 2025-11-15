from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestimonyViewSet

router = DefaultRouter()
router.register(r'testimonies', TestimonyViewSet, basename='testimony')

urlpatterns = [
    path('', include(router.urls)),
]
