import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Skeleton } from "../pages/Skeleton";

export const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true); // Show loading initially
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/invoice`);
      setInvoices(data.invoices);
    } catch (err) {
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false); // Loading complete
    }
  };

  if (loading) {
    // Show skeleton while data is loading
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Invoice List</h1>
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Invoice List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4">Invoice #</th>
            <th className="py-2 px-4">Customer</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td className="border px-4 py-2">{invoice.invoice_number}</td>
              <td className="border px-4 py-2">{invoice.customer_name}</td>
              <td className="border px-4 py-2">{new Date(invoice.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                $
                {invoice.details.reduce(
                  (total, detail) =>
                    total + detail.quantity * detail.unit_price,
                  0
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
