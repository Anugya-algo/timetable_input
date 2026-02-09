from rest_framework import views, status, response, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import ReferencePDF
from .cloudinary_service import CloudinaryService

class UploadPDFView(views.APIView):
    """Upload PDF directly to Cloudinary."""
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated for testing
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print("=== PDF Upload Request ===")
        file = request.FILES.get('file')
        note = request.data.get('note', '')
        department = request.data.get('department', 'default')
        
        if not file:
            print("Error: No file provided")
            return response.Response(
                {'error': 'File is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print(f"File received: {file.name}, size: {file.size}")
        
        # Validate file type
        if not file.name.lower().endswith('.pdf'):
            print("Error: Not a PDF file")
            return response.Response(
                {'error': 'Only PDF files are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Upload to Cloudinary
        print(f"Uploading to Cloudinary, folder: timetable_pdfs/{department}")
        cloudinary_service = CloudinaryService()
        folder = f"timetable_pdfs/{department}"
        
        try:
            result = cloudinary_service.upload_file(
                file,
                folder=folder,
                resource_type="raw"
            )
        except Exception as e:
            print(f"Cloudinary exception: {e}")
            return response.Response(
                {'error': f'Cloudinary error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        if not result:
            print("Error: Cloudinary returned None")
            return response.Response(
                {'error': 'Failed to upload file to cloud storage. Check Cloudinary credentials.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        print(f"Cloudinary upload success: {result['url']}")
        
        # Save to database
        try:
            pdf = ReferencePDF.objects.create(
                department_id=None,  # No department for now
                cloudinary_public_id=result['public_id'],
                cloudinary_url=result['url'],
                filename=file.name,
                file_size=result.get('bytes', 0),
                note=note
            )
            
            print(f"Database save success, ID: {pdf.id}")
            
            return response.Response({
                'status': 'success',
                'id': str(pdf.id),
                'url': result['url'],
                'filename': file.name
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Database error: {e}")
            cloudinary_service.delete_file(result['public_id'], resource_type="raw")
            return response.Response(
                {'error': f'Database error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListPDFsView(views.APIView):
    """List uploaded PDFs."""
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated for testing
    
    def get(self, request):
        pdfs = ReferencePDF.objects.all()
        
        data = [{
            'id': str(pdf.id),
            'filename': pdf.filename,
            'url': pdf.cloudinary_url,
            'note': pdf.note,
            'uploaded_at': pdf.uploaded_at.isoformat() if pdf.uploaded_at else None
        } for pdf in pdfs]
        
        return response.Response(data)
