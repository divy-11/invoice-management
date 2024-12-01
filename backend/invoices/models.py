from django.db import models

class InvoiceDetail(models.Model):
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} ({self.quantity} x {self.unit_price})"

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=255)
    date = models.DateField()
    details = models.ManyToManyField(InvoiceDetail)

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.customer_name}"
