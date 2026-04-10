import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { productPlaceholder } from "../lib/images";

export default function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = items.length ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
          <div>
            <h3 className="mb-1">Your Cart</h3>
            <div className="text-muted">
              Review items, update quantity, and checkout.
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/shop" className="btn btn-outline-dark btn-sm">
              Continue shopping
            </Link>
            {items.length ? (
              <button className="btn btn-outline-danger btn-sm" onClick={cart?.clear}>
                Clear cart
              </button>
            ) : null}
          </div>
        </div>

        {!items.length ? (
          <div className="alert alert-light border">
            Cart is empty. <Link to="/shop">Go to shop</Link>.
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="bg-white border rounded-4 overflow-hidden">
                <div className="p-3 border-bottom fw-semibold">Items</div>
                <div className="p-3">
                  <div className="d-flex flex-column gap-3">
                    {items.map((it) => (
                      <div
                        className="d-flex flex-wrap align-items-center gap-3"
                        key={it.id}
                      >
                        <img
                          src={it.image}
                          width="84"
                          height="84"
                          alt={it.name}
                          className="rounded-3 object-fit-cover border"
                          onError={(e) => {
                            const el = e.currentTarget;
                            if (el?.dataset?.fallbackApplied) return;
                            if (el?.dataset) el.dataset.fallbackApplied = "1";
                            el.src = productPlaceholder(it.name);
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{it.name}</div>
                          <div className="text-muted small">
                            ₹{it.price} • {it.category}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            className="form-control form-control-sm"
                            style={{ width: 88 }}
                            value={it.qty || 1}
                            onChange={(e) => cart?.setQty(it.id, e.target.value)}
                          />
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => cart?.removeItem(it.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="bg-white border rounded-4 p-3">
                <div className="fw-semibold mb-2">Order summary</div>
                <div className="d-flex justify-content-between text-muted">
                  <div>Subtotal</div>
                  <div>₹{subtotal}</div>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <div>Shipping</div>
                  <div>₹{shipping}</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <div className="fw-semibold">Total</div>
                  <div className="fw-semibold">₹{total}</div>
                </div>
                <button
                  className="btn btn-dark w-100 mt-3"
                  type="button"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </button>
                <div className="small text-muted mt-2">
                  Checkout is UI-only right now (backend can be integrated later).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

