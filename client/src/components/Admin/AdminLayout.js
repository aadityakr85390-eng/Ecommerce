import React from "react";
import { NavLink } from "react-router-dom";
import Layout from "../Layout/Layout";

export default function AdminLayout({ children, title = "Admin" }) {
  return (
    <Layout>
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-12 col-lg-3">
            <div className="bg-white border rounded-4 p-3">
              <div className="fw-semibold mb-2">{title}</div>
              <div className="list-group">
                <NavLink to="/dashboard/admin" className="list-group-item list-group-item-action">
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/admin/categories" className="list-group-item list-group-item-action">
                  Categories
                </NavLink>
                <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
                  Products
                </NavLink>
                <NavLink to="/dashboard/admin/products/new" className="list-group-item list-group-item-action">
                  Add product
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-9">{children}</div>
        </div>
      </div>
    </Layout>
  );
}

