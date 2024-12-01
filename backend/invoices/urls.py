from django.urls import path
from .views import InvoiceListCreateView, InvoiceDetailView

urlpatterns = [
    path('', InvoiceListCreateView.as_view(), name='invoice-list-create'),  
    path('<str:invoice_number>/', InvoiceDetailView.as_view(), name='invoice-detail'),  
]
