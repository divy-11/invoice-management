class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']

class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ['invoice_number', 'customer_name', 'date', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        invoice = Invoice.objects.create(**validated_data)
        for detail_data in details_data:
            detail = InvoiceDetail.objects.create(**detail_data)
            invoice.details.append(detail)
        invoice.save()
        return invoice

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if details_data:
            instance.details = []
            for detail_data in details_data:
                detail = InvoiceDetail.objects.create(**detail_data)
                instance.details.append(detail)

        instance.save()
        return instance