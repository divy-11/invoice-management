from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        invoice = Invoice.objects.create(**validated_data)
        for detail_data in details_data:
            detail = InvoiceDetail.objects.create(**detail_data)
            invoice.details.add(detail)
        return invoice

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details')
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        instance.details.clear()
        for detail_data in details_data:
            detail = InvoiceDetail.objects.create(**detail_data)
            instance.details.add(detail)

        return instance
