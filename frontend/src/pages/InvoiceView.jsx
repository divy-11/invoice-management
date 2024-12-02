import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Skeleton } from "../pages/Skeleton";

export const InvoiceView = () => {
  const para = useParams();
  const invoice_number = para.id;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/invoice/${invoice_number}`);
        setInvoice(data.invoice);
      } catch (err) {
        setError("Failed to fetch invoice.");
      } finally {
        setLoading(false);
      }
    };

    if (invoice_number) {
      fetchInvoice();
    }
  }, [invoice_number]);

  const formatDecimal = (value) => {
    return value && value.$numberDecimal ? parseFloat(value.$numberDecimal).toFixed(2) : value;
  };

  const calculateTotalAmount = () => {
    if (invoice.details) {
      return invoice.details.reduce((total, item) => {
        const lineTotal = parseFloat(formatDecimal(item.line_total));
        return total + (isNaN(lineTotal) ? 0 : lineTotal);
      }, 0).toFixed(2);
    }
    return "0.00";
  };


  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Invoice Details</h1>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500"><h1>{error}</h1></div>;
  }

  if (!invoice) {
    return <div className="p-4 text-red-500"><h1>Invoice not found</h1></div>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg h-screen">
      <div className="flex justify-between items-center m-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Invoice Details</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Go to Invoice List
        </button>
      </div>

      <div className="bg-white my-6 mx-12 p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="invoice_number" className="w-1/4 font-medium text-gray-700">Invoice Number:</label>
          <span id="invoice_number" className="w-3/4 text-gray-600">{invoice.invoice_number}</span>
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="customer_name" className="w-1/4 font-medium text-gray-700">Customer Name:</label>
          <input
            id="customer_name"
            type="text"
            className="w-3/4 p-2 border rounded-md border-gray-300 focus:border-indigo-500"
            value={invoice.customer_name}
            disabled
          />
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="date" className="w-1/4 font-medium text-gray-700">Date:</label>
          <input
            id="date"
            type="date"
            className="w-3/4 p-2 border rounded-md border-gray-300 focus:border-indigo-500"
            value={new Date(invoice.date).toLocaleDateString("en-CA")}
            disabled
          />
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="total_amount" className="w-1/4 font-medium text-gray-700">Total Amount:</label>
          <span id="total_amount" className="w-3/4 text-gray-600">${calculateTotalAmount()}</span>
        </div>

        <h3 className="font-semibold text-gray-700">Invoice Details:</h3>
        <ul className="space-y-2">
          {invoice.details.map((item, idx) => (
            <li key={idx} className="flex items-center space-x-4">
              <input
                type="text"
                className="w-1/4 p-2 border rounded-md border-gray-300 focus:border-indigo-500"
                value={item.description}
                disabled
              />
              <input
                type="number"
                className="w-1/4 p-2 border rounded-md border-gray-300 focus:border-indigo-500"
                value={formatDecimal(item.quantity)}
                disabled
              />
              <input
                type="number"
                className="w-1/4 p-2 border rounded-md border-gray-300 focus:border-indigo-500"
                value={formatDecimal(item.unit_price)}
                disabled
              />
              <span className="w-1/4 text-gray-600">{formatDecimal(item.line_total)}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/invoice/${invoice.invoice_number}/edit`)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Edit Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
