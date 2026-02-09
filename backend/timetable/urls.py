from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacultyViewSet, RoomViewSet, SubjectViewSet, TimetableEntryViewSet

router = DefaultRouter()
router.register(r'faculty', FacultyViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'entries', TimetableEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
