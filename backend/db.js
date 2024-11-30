const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://Admin:jZEOL6CqWnapaRou@cluster0.g8cch4b.mongodb.net/Invoice', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const { Decimal128 } = mongoose.Types;

const detailSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Decimal128,
        required: true,
        min: 1
    },
    unit_price: {
        type: Decimal128,
        required: true,
        min: 0
    },
    line_total: {
        type: Decimal128,
        required: true,
        default: function () {
            return this.quantity * this.unit_price;
        }
    }
});

const invoiceSchema = new mongoose.Schema({
    invoice_number: {
        type: String,
        required: true,
        unique: true
    },
    customer_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    details: [detailSchema]
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
const InvoiceDetail = mongoose.model('InvoiceDetail', detailSchema);

module.exports = { Invoice, InvoiceDetail };