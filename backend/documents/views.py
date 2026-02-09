from rest_framework import views, status, response, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import ReferencePDF
from .cloudinary_service import CloudinaryService

class UploadPDFView(views.APIView):
    """Upload PDF directly to Cloudinary."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        note = request.data.get('note', '')
        
        if not file:
            return response.Response(
                {'error': 'File is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        if not file.name.lower().endswith('.pdf'):
            return response.Response(
                {'error': 'Only PDF files are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get department from user
        department_id = getattr(request.user, 'department_id', None)
        if not department_id:
            # For testing, allow upload without department
            department_id = 'default'
        
        # Upload to Cloudinary
        cloudinary_service = CloudinaryService()
        folder = f"timetable_pdfs/{department_id}"
        
        result = cloudinary_service.upload_file(
            file,
            folder=folder,
            resource_type="raw"
        )
        
        if not result:
            return response.Response(
                {'error': 'Failed to upload file to cloud storage'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Save to database
        try:
            pdf = ReferencePDF.objects.create(
                department_id=department_id if department_id != 'default' else None,
                cloudinary_public_id=result['public_id'],
                cloudinary_url=result['url'],
                filename=file.name,
                file_size=result.get('bytes', 0),
                note=note
            )
            
            return response.Response({
                'status': 'success',
                'id': str(pdf.id),
                'url': result['url'],
                'filename': file.name
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # If DB save fails, delete from Cloudinary
            cloudinary_service.delete_file(result['public_id'], resource_type="raw")
            return response.Response(
                {'error': f'Database error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListPDFsView(views.APIView):
    """List uploaded PDFs for the user's department."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        department_id = getattr(request.user, 'department_id', None)
        
        # For testing, show all if no department
        if department_id:
            pdfs = ReferencePDF.objects.filter(department_id=department_id)
        else:
            pdfs = ReferencePDF.objects.all()
        
        data = [{
            'id': str(pdf.id),
            'filename': pdf.filename,
            'url': pdf.cloudinary_url,
            'note': pdf.note,
            'uploaded_at': pdf.uploaded_at.isoformat() if pdf.uploaded_at else None
        } for pdf in pdfs]
        
        return response.Response(data)
