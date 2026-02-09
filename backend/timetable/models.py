from django.db import models
import uuid
from meta.models import Department

class Faculty(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='faculty')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    designation = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    ROOM_TYPES = [
        ('Lecture', 'Lecture'),
        ('Lab', 'Lab'),
        ('Seminar', 'Seminar'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=50)
    capacity = models.IntegerField()
    type = models.CharField(max_length=20, choices=ROOM_TYPES)

    class Meta:
        unique_together = ('department', 'name')

    def __str__(self):
        return f"{self.name} ({self.type})"

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    credits = models.IntegerField()

    class Meta:
        unique_together = ('department', 'code')

    def __str__(self):
        return f"{self.name} ({self.code})"

class TimetableEntry(models.Model):
    DAYS = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    
    semester = models.IntegerField()
    section = models.CharField(max_length=10)
    academic_year = models.IntegerField()
    
    class Meta:
        indexes = [
            models.Index(fields=['department', 'day_of_week']),
            models.Index(fields=['department', 'room', 'day_of_week']),
            models.Index(fields=['department', 'faculty', 'day_of_week']),
        ]
        verbose_name_plural = "Timetable Entries"

    def __str__(self):
        return f"{self.subject.code} - {self.day_of_week} {self.start_time}"
