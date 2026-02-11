from django.urls import path
from .views import UploadPDFView, ListPDFsView, DownloadPDFView

urlpatterns = [
    path('upload/', UploadPDFView.as_view(), name='upload-pdf'),
    path('list/', ListPDFsView.as_view(), name='list-pdfs'),
    path('download/<uuid:pdf_id>/', DownloadPDFView.as_view(), name='download-pdf'),
]
