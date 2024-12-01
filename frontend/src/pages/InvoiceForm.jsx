import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Skeleton } from "../pages/Skeleton";

export const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoice_number: "",
    customer_name: "",
    date: "",
    details: [{ description: "", quantity: 1, unit_price: 0 }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/invoice/${id}`);
      setFormData(data.invoice);
    } catch (err) {
      setError("Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${BACKEND_URL}/invoice/${id}`, formData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(`${BACKEND_URL}/invoice`, formData, {
          headers: { "Content-Type": "application/json" },
        });
      }
      navigate("/");
    } catch (err) {
      alert("Failed to save invoice");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-3xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{id ? "Edit Invoice" : "New Invoice"}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={formData.invoice_number}
              onChange={(e) =>
                setFormData({ ...formData, invoice_number: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Customer Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Invoice Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Invoice Details</label>
            {formData.details.map((detail, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={detail.description}
                  onChange={(e) => {
                    const details = [...formData.details];
                    details[index].description = e.target.value;
                    setFormData({ ...formData, details });
                  }}
                  required
                  className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={detail.quantity}
                  onChange={(e) => {
                    const details = [...formData.details];
                    details[index].quantity = +e.target.value;
                    setFormData({ ...formData, details });
                  }}
                  required
                  className="w-1/4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={detail.unit_price}
                  onChange={(e) => {
                    const details = [...formData.details];
                    details[index].unit_price = +e.target.value;
                    setFormData({ ...formData, details });
                  }}
                  required
                  className="w-1/4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  details: [
                    ...formData.details,
                    { description: "", quantity: 1, unit_price: 0 },
                  ],
                })
              }
              className="text-sm text-blue-600 hover:underline focus:outline-none transition"
            >
              + Add Line Item
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Save Invoice
          </button>
        </form>
      </div>
    </div>
  );
};
