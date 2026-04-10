import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";

export default function AdminProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auth] = useAuth();

  const isEdit = mode === "edit";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");

  const title = useMemo(() => (isEdit ? "Edit Product" : "Add Product"), [isEdit]);

  const loadCategories = async () => {
    const { data } = await api.get("/api/v1/category");
    setCategories(data?.categories || []);
  };

  const loadProduct = async () => {
    const { data } = await api.get(`/api/v1/product/${id}`);
    const p = data?.product;
    if (!p) return;
    setName(p.name || "");
    setDescription(p.description || "");
    setPrice(String(p.price ?? ""));
    setCategoryId(p.category?._id || "");
    setQuantity(String(p.quantity ?? ""));
    setPhotoUrl(p.photoUrl || "");
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("categoryId", categoryId);
      form.append("quantity", quantity);
      if (photo) form.append("photo", photo);

      const headers = { Authorization: auth?.token };

      const { data } = isEdit
        ? await api.put(`/api/v1/product/${id}`, form, { headers })
        : await api.post("/api/v1/product", form, { headers });

      if (data?.success) {
        toast.success(isEdit ? "Product updated" : "Product created");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const del = async () => {
    if (!isEdit) return;
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const { data } = await api.delete(`/api/v1/product/${id}`, {
        headers: { Authorization: auth?.token },
      });
      if (data?.success) {
        toast.success("Product deleted");
        navigate("/dashboard/admin/products");
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
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">{title}</h4>
        <Link className="btn btn-outline-dark btn-sm" to="/dashboard/admin/products">
          Back
        </Link>
      </div>

      <div className="bg-white border rounded-4 p-4">
        <form onSubmit={submit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Product name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Price (₹)</label>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Category</label>
            <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Photo</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            {photoUrl && !photo ? (
              <div className="mt-2">
                <img
                  src={`${process.env.REACT_APP_API}${photoUrl}`}
                  alt="current"
                  className="rounded border"
                  style={{ width: 220, height: 160, objectFit: "cover" }}
                />
              </div>
            ) : null}
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-dark" disabled={loading} type="submit">
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            {isEdit ? (
              <button className="btn btn-outline-danger" disabled={loading} type="button" onClick={del}>
                Delete
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

