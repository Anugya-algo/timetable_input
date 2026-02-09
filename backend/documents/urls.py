from django.urls import path
from .views import UploadPDFView, ListPDFsView

urlpatterns = [
    path('upload/', UploadPDFView.as_view(), name='upload-pdf'),
    path('list/', ListPDFsView.as_view(), name='list-pdfs'),
]
