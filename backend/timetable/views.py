from rest_framework import viewsets, permissions
from .models import Faculty, Room, Subject, TimetableEntry
from .serializers import FacultySerializer, RoomSerializer, SubjectSerializer, TimetableEntrySerializer

class DepartmentScopedViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that filters querysets by the user's department
    and assigns the department on create.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return self.queryset.none()
        
        # Assuming middleware attaches department_id to user or we look it up
        # For now, we'll try to get it from a hypothetical attribute or profile
        department_id = getattr(user, 'department_id', None)
        
        if department_id:
            return self.queryset.filter(department_id=department_id)
        return self.queryset.none()

    def perform_create(self, serializer):
        user = self.request.user
        department_id = getattr(user, 'department_id', None)
        if department_id:
            serializer.save(department_id=department_id)
        else:
            # Fallback or error if no department found
            # For development without auth/middleware working yet, we might need a workaround
            pass

class FacultyViewSet(DepartmentScopedViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class RoomViewSet(DepartmentScopedViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class SubjectViewSet(DepartmentScopedViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class TimetableEntryViewSet(DepartmentScopedViewSet):
    queryset = TimetableEntry.objects.all()
    serializer_class = TimetableEntrySerializer
