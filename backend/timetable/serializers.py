from rest_framework import serializers
from .models import Faculty, Room, Subject, TimetableEntry

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'
        read_only_fields = ['department']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['department']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ['department']

class TimetableEntrySerializer(serializers.ModelSerializer):
    faculty_details = FacultySerializer(source='faculty', read_only=True)
    subject_details = SubjectSerializer(source='subject', read_only=True)
    room_details = RoomSerializer(source='room', read_only=True)

    class Meta:
        model = TimetableEntry
        fields = [
            'id', 'department', 'day_of_week', 'start_time', 'end_time',
            'faculty', 'subject', 'room', 'semester', 'section', 'academic_year',
            'faculty_details', 'subject_details', 'room_details'
        ]
        read_only_fields = ['department']

    def validate(self, data):
        """
        Check for overlaps:
        1. Room overlap
        2. Faculty overlap
        """
        department = self.context['request'].user.department_id if hasattr(self.context['request'].user, 'department_id') else None
        # Note: In production, department should come from context/user. 
        # For now, we assume it's passed or handled in view.
        
        # Room Overlap
        if TimetableEntry.objects.filter(
            day_of_week=data['day_of_week'],
            room=data['room'],
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time']
        ).exists():
            raise serializers.ValidationError({"room": "This room is already booked for this time slot."})

        # Faculty Overlap
        if TimetableEntry.objects.filter(
            day_of_week=data['day_of_week'],
            faculty=data['faculty'],
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time']
        ).exists():
            raise serializers.ValidationError({"faculty": "This faculty member is already assigned to a class in this time slot."})

        return data
