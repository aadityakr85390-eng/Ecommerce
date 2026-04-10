import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import { api } from "../../lib/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const { data } = await api.get("/api/v1/product");
    setProducts(data?.products || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout title="Admin Panel">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Products</h4>
        <Link className="btn btn-dark btn-sm" to="/dashboard/admin/products/new">
          Add product
        </Link>
      </div>

      <div className="bg-white border rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.photoUrl ? `${process.env.REACT_APP_API}${p.photoUrl}` : ""}
                      alt={p.name}
                      style={{ width: 64, height: 48, objectFit: "cover" }}
                      className="rounded border bg-light"
                    />
                  </td>
                  <td className="fw-semibold">{p.name}</td>
                  <td className="text-muted">{p.category?.name || "-"}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <Link
                      className="btn btn-outline-dark btn-sm"
                      to={`/dashboard/admin/products/${p._id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td colSpan="5" className="text-muted p-4">
                    No products yet.
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

