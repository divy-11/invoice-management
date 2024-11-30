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
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Invoice...</h1>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{id ? "Edit Invoice" : "New Invoice"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Invoice Number</label>
          <input
            type="text"
            value={formData.invoice_number}
            onChange={(e) =>
              setFormData({ ...formData, invoice_number: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Customer Name</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) =>
              setFormData({ ...formData, customer_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Details</label>
          {formData.details.map((detail, index) => (
            <div key={index} className="flex gap-2">
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
          >
            Add Line Item
          </button>
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Save Invoice
        </button>
      </form>
    </div>
  );
};
