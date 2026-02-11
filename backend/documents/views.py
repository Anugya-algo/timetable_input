from rest_framework import views, status, response, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from .models import ReferencePDF
from .cloudinary_service import CloudinaryService
import requests as http_requests
import zipfile
import io


class UploadPDFView(views.APIView):
    """Upload PDF directly to Cloudinary."""
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print("=== PDF Upload Request ===")
        file = request.FILES.get('file')
        note = request.data.get('note', '')
        department = request.data.get('department', 'default')
        
        if not file:
            return response.Response(
                {'error': 'File is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print(f"File received: {file.name}, size: {file.size}")
        
        if not file.name.lower().endswith('.pdf'):
            return response.Response(
                {'error': 'Only PDF files are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
            return response.Response(
                {'error': 'Failed to upload to cloud storage.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        print(f"Cloudinary upload success: {result['url']}")
        
        try:
            pdf = ReferencePDF.objects.create(
                department_id=None,
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
            print(f"Database error: {e}")
            cloudinary_service.delete_file(result['public_id'], resource_type="raw")
            return response.Response(
                {'error': f'Database error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListPDFsView(views.APIView):
    """List uploaded PDFs with backend proxy download URLs."""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        pdfs = ReferencePDF.objects.all().order_by('-uploaded_at')
        
        # Build download URLs that go through our backend proxy
        backend_base = request.build_absolute_uri('/api/v1/documents/')
        
        data = [{
            'id': str(pdf.id),
            'filename': pdf.filename,
            'url': f"{backend_base}download/{pdf.id}/",
            'note': pdf.note,
            'uploaded_at': pdf.uploaded_at.isoformat() if pdf.uploaded_at else None
        } for pdf in pdfs]
        
        return response.Response(data)


class DownloadPDFView(views.APIView):
    """
    Proxy download endpoint.
    Uses Cloudinary's archive API to fetch the PDF (bypasses CDN delivery restrictions),
    extracts it from the zip, and serves it directly as a PDF.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pdf_id):
        try:
            pdf = ReferencePDF.objects.get(id=pdf_id)
        except ReferencePDF.DoesNotExist:
            return response.Response(
                {'error': 'PDF not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            # Use Cloudinary archive API to get a download URL
            cloudinary_service = CloudinaryService()
            download_url = cloudinary_service.get_download_url(pdf.cloudinary_public_id)
            
            if not download_url:
                return response.Response(
                    {'error': 'Could not generate download URL'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Fetch the zip archive from Cloudinary
            cloudinary_response = http_requests.get(download_url, timeout=30)
            
            if cloudinary_response.status_code != 200:
                return response.Response(
                    {'error': f'Cloudinary returned {cloudinary_response.status_code}'}, 
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
            # The archive API returns a zip file - extract the PDF from it
            zip_buffer = io.BytesIO(cloudinary_response.content)
            
            try:
                with zipfile.ZipFile(zip_buffer, 'r') as zf:
                    # Get the first (and only) file in the zip
                    file_list = zf.namelist()
                    if not file_list:
                        return response.Response(
                            {'error': 'Empty archive'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                    
                    pdf_content = zf.read(file_list[0])
                    
                    resp = HttpResponse(
                        pdf_content,
                        content_type='application/pdf'
                    )
                    resp['Content-Disposition'] = f'inline; filename="{pdf.filename}"'
                    resp['Access-Control-Allow-Origin'] = '*'
                    return resp
                    
            except zipfile.BadZipFile:
                # If not a zip, try serving the content directly (it may be raw PDF)
                resp = HttpResponse(
                    cloudinary_response.content,
                    content_type='application/pdf'
                )
                resp['Content-Disposition'] = f'inline; filename="{pdf.filename}"'
                resp['Access-Control-Allow-Origin'] = '*'
                return resp
                
        except Exception as e:
            print(f"Download proxy error: {e}")
            return response.Response(
                {'error': f'Download failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
