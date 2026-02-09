from django.db import models
import uuid

class ReferencePDF(models.Model):
    """Stores reference PDFs uploaded by department in-charges."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department_id = models.UUIDField(null=True, blank=True, db_index=True)
    
    # Cloudinary fields
    cloudinary_public_id = models.CharField(max_length=255)
    cloudinary_url = models.URLField(max_length=500)
    
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    note = models.TextField(blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Reference PDF'
        verbose_name_plural = 'Reference PDFs'
    
    def __str__(self):
        return f"{self.filename} ({self.uploaded_at})"
