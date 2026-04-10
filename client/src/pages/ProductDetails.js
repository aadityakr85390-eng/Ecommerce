import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { productPlaceholder } from "../lib/images";
import { api } from "../lib/api";

export default function ProductDetails() {
  const { id } = useParams();
  const cart = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/v1/product/${id}`);
        if (data?.product) {
          const p = data.product;
          setProduct({
            ...p,
            id: p._id,
            categoryName: p.category?.name || "",
          });
        }
      } catch {
        setProduct(null);
      }
    };
    load();
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-light border">
            Product not found.{" "}
            <Link to="/shop" className="alert-link">
              Go back to shop
            </Link>
            .
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="mb-3">
          <Link to="/shop" className="btn btn-outline-dark btn-sm">
            ← Back
          </Link>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="ratio ratio-4x3 bg-light rounded-4 overflow-hidden border">
              <img
                src={product.image}
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el?.dataset?.fallbackApplied) return;
                  if (el?.dataset) el.dataset.fallbackApplied = "1";
                  el.src = productPlaceholder(product.name);
                }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-start justify-content-between gap-2">
              <div>
                <div className="text-muted small mb-2">{product.categoryName}</div>
                <h2 className="mb-2">{product.name}</h2>
              </div>
              {product.badge ? (
                <span className="badge rounded-pill text-bg-warning align-self-start">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="h4 mb-0">₹{product.price}</div>
              <div className="text-muted">
                Rating: <span className="fw-semibold">{product.rating}</span>/5
              </div>
            </div>

            <p className="text-muted">{product.description}</p>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-dark btn-lg"
                onClick={() => cart?.addItem(product)}
              >
                Add to cart
              </button>
              <Link to="/cart" className="btn btn-outline-dark btn-lg">
                Go to cart
              </Link>
            </div>

            <hr className="my-4" />

            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 bg-white border rounded-4">
                  <div className="small text-muted">Delivery</div>
                  <div className="fw-semibold">2–5 days</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white border rounded-4">
                  <div className="small text-muted">Returns</div>
                  <div className="fw-semibold">7 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

