import React from "react";
import AdminLayout from "../../components/Admin/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Panel">
      <div className="bg-white border rounded-4 p-4">
        <h3 className="mb-2">Admin Dashboard</h3>
        <p className="text-muted mb-0">
          Manage categories and products (create/update/delete) from the left menu.
        </p>
      </div>
    </AdminLayout>
  );
}

