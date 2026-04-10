import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/cart";
import { api } from "../lib/api";
import { useAuth } from "../context/auth";

const HomePage = () => {
  const cart = useCart();
  const [auth] = useAuth();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: prod }, { data: cat }] = await Promise.all([
          api.get("/api/v1/product"),
          api.get("/api/v1/category"),
        ]);
        const list = (prod?.products || []).map((p) => ({
          ...p,
          id: p._id,
          categoryName: p.category?.name || "",
        }));
        setFeatured(list.slice(0, 4));
        setCategories(cat?.categories || []);
      } catch {
        // ignore in UI
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="hero p-4 p-md-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 small mb-3">
                <span className="badge rounded-pill text-bg-light text-dark">
                  Fast delivery
                </span>
                <span className="text-white-50">New arrivals every week</span>
              </div>
              <h1 className="display-6 fw-bold mb-3">
                Shop smart. Look sharp.{" "}
                <span className="text-white-50">All in one place.</span>
              </h1>
              <p className="text-white-50 mb-4">
                A clean ecommerce frontend with real products from the backend
                and a working cart.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/shop" className="btn btn-light btn-lg">
                  Explore shop
                </Link>
                <Link to="/cart" className="btn btn-outline-light btn-lg">
                  Cart ({cart?.count ?? 0})
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-4 p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-white-50 small">Today’s deal</div>
                    <div className="h4 mb-0">Up to 40% off</div>
                  </div>
                  <div className="text-white-50 small text-end">
                    Use code
                    <div className="fw-semibold text-white">WELCOME40</div>
                  </div>
                </div>
                <hr className="border-white border-opacity-25" />
                <div className="row g-2">
                  {categories.slice(0, 4).map((c) => (
                    <div className="col-6" key={c._id}>
                      <Link
                        to={`/category?c=${encodeURIComponent(c.name)}`}
                        className="btn btn-outline-light w-100"
                      >
                        {c.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Featured</h4>
          <Link to="/shop" className="btn btn-outline-dark btn-sm">
            View all
          </Link>
        </div>

        <div className="row g-3 g-md-4">
          {featured.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard product={p} onAdd={cart?.addItem} />
            </div>
          ))}
        </div>

        {!auth?.user ? (
          <div className="mt-5 p-4 p-md-5 bg-white rounded-4 border">
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <h4 className="mb-2">Login + Dashboard ready</h4>
                <p className="text-muted mb-0">
                  Auth endpoints already exist (`/api/v1/auth/*`). Next we can add
                  product APIs and hook the UI to real data.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <Link to="/login" className="btn btn-dark">
                  Login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-4 p-md-5 bg-white rounded-4 border">
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <h4 className="mb-2">
                  Welcome, {auth?.user?.name || "User"}
                </h4>
                <p className="text-muted mb-0">
                  Your dashboard is ready.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <Link
                  to={auth?.user?.role === 1 ? "/dashboard/admin" : "/dashboard"}
                  className="btn btn-dark"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HomePage