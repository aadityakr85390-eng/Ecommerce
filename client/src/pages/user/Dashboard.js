import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState(auth?.user?.name || "");
  const [phone, setPhone] = useState(auth?.user?.phone || "");
  const [address, setAddress] = useState(auth?.user?.address || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(
        "/api/v1/auth/profile",
        { name, phone, address, password: password || undefined },
        { headers: { Authorization: auth?.token } }
      );
      if (data?.success) {
        toast.success("Profile updated");
        const updated = {
          ...auth,
          user: {
            ...auth.user,
            name: data.user.name,
            phone: data.user.phone,
            address: data.user.address,
          },
        };
        setAuth(updated);
        localStorage.setItem("auth", JSON.stringify(updated));
        setPassword("");
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="bg-white border rounded-4 p-3 h-100">
              <h5 className="mb-2">Your profile</h5>
              <p className="text-muted small mb-1">
                Email: <span className="fw-semibold">{auth?.user?.email}</span>
              </p>
              <p className="text-muted small mb-0">
                Role: {auth?.user?.role === 1 ? "Admin" : "User"}
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="bg-white border rounded-4 p-3 h-100">
              <h5 className="mb-3">Edit details</h5>
              <form onSubmit={handleUpdate} className="d-flex flex-column gap-2">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="form-control"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  className="form-control"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-dark mt-1" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="bg-white border rounded-4 p-3 h-100">
              <h5 className="mb-2">Your orders</h5>
              <p className="text-muted small mb-0">
                Order history UI is ready, but no orders are stored yet. Once we add an
                orders system, your past shopping will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;