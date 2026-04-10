import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";

export default function AdminCategories() {
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/api/v1/category");
    setCategories(data?.categories || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(
        "/api/v1/category",
        { name },
        { headers: { Authorization: auth?.token } }
      );
      if (data?.success) {
        toast.success("Category created");
        setName("");
        load();
      } else {
        toast.error(data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Panel">
      <div className="bg-white border rounded-4 p-4 mb-3">
        <h4 className="mb-3">Categories</h4>
        <form onSubmit={create} className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-dark" disabled={loading} type="submit">
            {loading ? "Saving..." : "Add"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-4 p-4">
        <div className="fw-semibold mb-2">All categories</div>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((c) => (
            <span className="badge text-bg-light border" key={c._id}>
              {c.name}
            </span>
          ))}
          {!categories.length ? <div className="text-muted">No categories</div> : null}
        </div>
      </div>
    </AdminLayout>
  );
}

