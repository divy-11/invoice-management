import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Skeleton } from "../pages/Skeleton";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";

export const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/invoice?page=${page}`);
      setInvoices(data.invoices);
    } catch (err) {
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/invoice/${invoiceToDelete.invoice_number}`);
      setInvoices(invoices.filter((invoice) => invoice.invoice_number !== invoiceToDelete.invoice_number));
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to delete invoice");
    }
  };

  const calculateTotalAmount = () => {
    if (invoices.details) {
      return invoices.details.reduce((total, item) => {
        const lineTotal = parseFloat(formatDecimal(item.line_total));
        return total + (isNaN(lineTotal) ? 0 : lineTotal);
      }, 0).toFixed(2);
    }
    return "0.00";
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Invoice List</h1>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 sm:mt-0 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => navigate('/invoice/new')}
        >
          Add Invoice
        </button>
      </div>

      <table className="table-auto w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">#</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Customer</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 hidden sm:table-cell">Total</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoice_number} className="hover:bg-gray-50 transition duration-200">
              <td className="border-t px-4 py-2 text-sm text-gray-600">{invoice.invoice_number}</td>
              <td className="border-t px-4 py-2 text-sm text-gray-600">{invoice.customer_name}</td>
              <td className="border-t px-4 py-2 text-sm text-gray-600">{invoice.date}</td>
              <td className="border-t px-4 py-2 text-sm text-gray-600 hidden sm:table-cell">${calculateTotalAmount(invoice.details)}</td>
              <td className="border-t px-4 py-2 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => navigate(`/invoice/${invoice.invoice_number}`)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={() => {
                    setInvoiceToDelete(invoice);
                    setIsModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteInvoice}
      />
    </div>
  );
};
