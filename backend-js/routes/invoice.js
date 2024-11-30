const express = require("express");
const { Invoice } = require("../db");
const app = express.Router();

const validateInvoice = (data) => {
    if (!data.invoice_number) {
        return { error: 'Invoice Number is required.' };
    }
    if (!data.customer_name) {
        return { error: 'Customer Name is required.' };
    }
    if (!data.date) {
        return { error: 'Date is required.' };
    }
    if (!Array.isArray(data.details)) {
        return { error: 'Details must be an array of line items.' };
    }
    for (let detail of data.details) {
        if (!detail.description || !detail.quantity || !detail.unit_price) {
            return { error: 'Each invoice detail must include description, quantity, and unit price.' };
        }
    }
    return { error: null };
};

app.post('/', async (req, res) => {
    const dataInv = req.body;

    const { error } = validateInvoice(dataInv);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const existingInvoice = await Invoice.findOne({ invoice_number: dataInv.invoice_number });

        if (existingInvoice) {
            existingInvoice.customer_name = dataInv.customer_name;
            existingInvoice.date = dataInv.date;
            existingInvoice.details = dataInv.details;
            existingInvoice.total_amount = existingInvoice.details.reduce(
                (sum, item) => sum + parseFloat(item.line_total.toString()),
                0
            );
            await existingInvoice.save();
            return res.status(200).json({ message: 'Invoice updated successfully', invoice: existingInvoice });
        } else {
            const newInvoice = await Invoice.create(dataInv);
            return res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error processing the invoice', error: error.message });
    }
});

app.put('/:invoice_number', async (req, res) => {
    const { invoice_number } = req.params;
    const dataInv = req.body;

    try {
        const invoice = await Invoice.findOne({ invoice_number });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.customer_name = dataInv.customer_name;
        invoice.date = dataInv.date;
        invoice.details = dataInv.details;
        invoice.total_amount = invoice.details.reduce(
            (sum, item) => sum + item.quantity * item.unit_price,
            0
        );

        await invoice.save();
        res.status(200).json({ message: 'Invoice updated successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
});


app.delete('/:invoice_number', async (req, res) => {
    const { invoice_number } = req.params;

    try {
        const deletedInvoice = await Invoice.findOneAndDelete({ invoice_number });

        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting the invoice', error: error.message });
    }
});

app.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10
  
    try {
      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Calculate total number of invoices
      const totalInvoices = await Invoice.countDocuments();
  
      // Fetch paginated invoices
      const invoices = await Invoice.find()
        .skip((pageNumber - 1) * limitNumber) // Skip documents based on page
        .limit(limitNumber) // Limit results to the specified number
        .sort({ date: -1 }); // Sort by date (newest first)
  
      res.status(200).json({
        invoices,
        totalPages: Math.ceil(totalInvoices / limitNumber), // Total number of pages
        currentPage: pageNumber,
        totalInvoices,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });



module.exports = app;
