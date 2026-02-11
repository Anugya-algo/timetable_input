import cloudinary
import cloudinary.uploader
import cloudinary.utils
from django.conf import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class CloudinaryService:
    """Service for uploading files to Cloudinary."""
    
    def upload_file(self, file, folder="timetable_pdfs", resource_type="raw"):
        """
        Upload a file to Cloudinary.
        
        Args:
            file: The file object to upload
            folder: Cloudinary folder path
            resource_type: 'raw' for PDFs, 'image' for images
            
        Returns:
            dict with url and public_id, or None on failure
        """
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                resource_type=resource_type,
                use_filename=True,
                unique_filename=True,
                access_mode='public'
            )
            return {
                'url': result.get('secure_url'),
                'public_id': result.get('public_id'),
                'format': result.get('format'),
                'bytes': result.get('bytes')
            }
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return None
    
    def delete_file(self, public_id, resource_type="raw"):
        """Delete a file from Cloudinary."""
        try:
            result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            return result.get('result') == 'ok'
        except Exception as e:
            print(f"Cloudinary delete error: {e}")
            return False
    
    def get_download_url(self, public_id, resource_type="raw"):
        """
        Get a download URL using Cloudinary's archive API.
        This bypasses CDN delivery restrictions (PDF/ZIP ACL block).
        Returns a signed URL through api.cloudinary.com.
        """
        try:
            url = cloudinary.utils.download_archive_url(
                public_ids=[public_id],
                resource_type=resource_type
            )
            return url
        except Exception as e:
            print(f"Cloudinary download URL error: {e}")
            return None
