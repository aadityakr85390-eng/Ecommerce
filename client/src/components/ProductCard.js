import React from "react";
import { Link } from "react-router-dom";
import { productPlaceholder } from "../lib/images";

export default function ProductCard({ product, onAdd }) {
  const imgSrc = product.photoUrl
    ? `${process.env.REACT_APP_API}${product.photoUrl}`
    : product.image || "";

  return (
    <div className="card h-100 product-card">
      <div className="ratio ratio-4x3 bg-light">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            if (el?.dataset?.fallbackApplied) return;
            if (el?.dataset) el.dataset.fallbackApplied = "1";
            el.src = productPlaceholder(product.name);
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <h6 className="mb-1">{product.name}</h6>
          {product.badge ? (
            <span className="badge rounded-pill text-bg-warning">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="text-muted small mb-2">
          {product.categoryName || (typeof product.category === "string" ? product.category : "")}
        </div>
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="fw-semibold">₹{product.price}</div>
          <div className="d-flex gap-2">
            <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-sm">
              View
            </Link>
            <button
              type="button"
              className="btn btn-dark btn-sm"
              onClick={() => onAdd?.(product)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

