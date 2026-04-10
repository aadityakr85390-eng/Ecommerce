import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "../../components/Admin/AdminLayout";
import { useAuth } from "../../context/auth";
import { api } from "../../lib/api";

const FALLBACK_STATUS_OPTIONS = [
  "paid",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const labelize = (status) => status.replaceAll("_", " ");

export default function AdminOrders() {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusOptions, setStatusOptions] = useState(FALLBACK_STATUS_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const load = async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const { data } = await api.get("/api/v1/order/admin/orders", {
        headers: { Authorization: auth.token },
      });
      setOrders(data?.orders || []);
      setStatusOptions(data?.statusOptions || FALLBACK_STATUS_OPTIONS);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  const updateStatus = async (orderId, status) => {
    setSavingId(orderId);
    try {
      const { data } = await api.put(
        `/api/v1/order/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: auth.token } }
      );
      if (data?.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
        toast.success("Order status updated");
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
    } finally {
      setSavingId("");
    }
  };

  return (
    <AdminLayout title="Admin Panel">
      <div className="bg-white border rounded-4 overflow-hidden">
        <div className="p-3 border-bottom">
          <h4 className="mb-1">Order Management</h4>
          <div className="text-muted small">
            Update packing, shipment, out-for-delivery and delivered status.
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <div className="fw-semibold">{o.buyer?.name}</div>
                    <div className="small text-muted">{o.buyer?.email}</div>
                    <div className="small text-muted">{o.buyer?.phone}</div>
                  </td>
                  <td className="small text-muted">
                    {o.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
                  </td>
                  <td>₹{o.totalAmount}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.status}
                      disabled={savingId === o._id}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {labelize(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="small text-muted">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!orders.length ? (
                <tr>
                  <td colSpan="5" className="text-muted p-4">
                    {loading ? "Loading orders..." : "No orders for your products yet."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
