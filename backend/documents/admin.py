from django.contrib import admin
from .models import ReferencePDF


@admin.register(ReferencePDF)
class ReferencePDFAdmin(admin.ModelAdmin):
    list_display = ('filename', 'note', 'file_size', 'uploaded_at', 'cloudinary_url')
    list_filter = ('uploaded_at',)
    search_fields = ('filename', 'note')
    readonly_fields = ('id', 'cloudinary_public_id', 'cloudinary_url', 'file_size', 'uploaded_at')
    ordering = ('-uploaded_at',)
