import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { toast } from "react-hot-toast";

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || "";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = items.length ? 99 : 0;
  const total = subtotal + shipping;

  const canPay = items.length > 0;
  const hasRazorpay = Boolean(RAZORPAY_KEY);

  const orderName = useMemo(
    () => `Ecommerce Demo Order (${items.length} items)`,
    [items.length]
  );

  useEffect(() => {
    if (!items.length) return;
  }, [items.length]);

  const demoPay = async () => {
    if (!canPay) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      cart?.clear?.();
      toast.success("Payment successful (demo)");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const razorpayPay = async () => {
    if (!canPay) return;
    setLoading(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const amountPaise = Math.round(total * 100);
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: amountPaise,
        currency: "INR",
        name: "Ecommerce App",
        description: orderName,
        handler: function () {
          cart?.clear?.();
          toast.success("Payment successful (Razorpay demo)");
          navigate("/");
        },
        theme: { color: "#111827" },
      });
      rzp.open();
    } catch (e) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
          <div>
            <h3 className="mb-1">Checkout</h3>
            <div className="text-muted">
              Demo payment flow for testing (no real money).
            </div>
          </div>
          <Link to="/cart" className="btn btn-outline-dark btn-sm">
            ← Back to cart
          </Link>
        </div>

        {!items.length ? (
          <div className="alert alert-light border">
            Your cart is empty. <Link to="/shop">Go to shop</Link>.
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="bg-white border rounded-4 p-3">
                <div className="fw-semibold mb-2">Order</div>
                <div className="d-flex flex-column gap-2">
                  {items.map((it) => (
                    <div
                      className="d-flex align-items-center justify-content-between"
                      key={it.id}
                    >
                      <div className="text-truncate pe-3">
                        <span className="fw-semibold">{it.name}</span>{" "}
                        <span className="text-muted small">
                          × {it.qty || 1}
                        </span>
                      </div>
                      <div className="text-muted">₹{it.price * (it.qty || 1)}</div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="d-flex justify-content-between text-muted">
                  <div>Subtotal</div>
                  <div>₹{subtotal}</div>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <div>Shipping</div>
                  <div>₹{shipping}</div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="fw-semibold">Total</div>
                  <div className="fw-semibold">₹{total}</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="bg-white border rounded-4 p-3">
                <div className="fw-semibold mb-2">Payment</div>

                <button
                  className="btn btn-dark w-100"
                  onClick={demoPay}
                  disabled={!canPay || loading}
                  type="button"
                >
                  {loading ? "Processing..." : "Pay (Demo Free)"}
                </button>
                <div className="small text-muted mt-2">
                  This is a fake payment (instant success) for demo/testing.
                </div>

                <hr />

                <button
                  className="btn btn-outline-dark w-100"
                  onClick={razorpayPay}
                  disabled={!canPay || loading || !hasRazorpay}
                  type="button"
                >
                  Pay with Razorpay (Test)
                </button>
                <div className="small text-muted mt-2">
                  {hasRazorpay ? (
                    "Razorpay test checkout enabled."
                  ) : (
                    <>
                      To enable Razorpay test checkout, add{" "}
                      <code>REACT_APP_RAZORPAY_KEY_ID</code> in{" "}
                      <code>client/.env</code>.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

