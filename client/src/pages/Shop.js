import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/cart";
import { api } from "../lib/api";

export default function Shop() {
  const cart = useCart();
  const [q, setQ] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(() => new Set());
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [products]);
  const [minPrice, setMinPrice] = useState(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [didInitPriceRange, setDidInitPriceRange] = useState(false);

  // Products load hone ke baad price range ko initial 0/0 se update karna zaroori hai.
  useEffect(() => {
    if (!products.length) return;
    if (didInitPriceRange) return;
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setDidInitPriceRange(true);
  }, [products.length, didInitPriceRange, priceBounds.min, priceBounds.max]);

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
        setProducts(list);
        setCategories(cat?.categories || []);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(p.categoryName);
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [q, selectedCategories, minPrice, maxPrice, products]);

  const toggleCategory = (c) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setQ("");
  };

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
          <div>
            <h3 className="mb-1">Shop</h3>
            <div className="text-muted">
              Browse products and add them to your cart.
            </div>
          </div>
          <div className="text-muted small">
            Items in cart: <span className="fw-semibold">{cart?.count ?? 0}</span>
          </div>
        </div>

        <div className="row g-3 g-md-4">
          {/* Left filters */}
          <div className="col-12 col-lg-3">
            <div className="bg-white border rounded-4 p-3 sticky-top" style={{ top: 88 }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-semibold">Filters</div>
                <button type="button" className="btn btn-outline-dark btn-sm" onClick={clearFilters}>
                  Reset
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Search</label>
                <input
                  className="form-control"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                />
              </div>

              <div className="mb-3">
                <div className="form-label small text-muted mb-2">Price range (₹)</div>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    min={priceBounds.min}
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="form-control"
                    min={minPrice}
                    max={priceBounds.max}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
                <div className="text-muted small mt-2">
                  {priceBounds.min} – {priceBounds.max}
                </div>
              </div>

              <div className="mb-2">
                <div className="form-label small text-muted mb-2">Category</div>
                <div className="d-flex flex-column gap-2">
                  {categories.map((c) => (
                    <label className="d-flex align-items-center gap-2" key={c._id}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(c.name)}
                        onChange={() => toggleCategory(c.name)}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="col-12 col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="text-muted small">
                Showing <span className="fw-semibold">{filtered.length}</span>{" "}
                products
              </div>
            </div>
            <div className="row g-3 g-md-4">
              {filtered.map((p) => (
                <div className="col-12 col-sm-6 col-xl-4" key={p.id}>
                  <ProductCard product={p} onAdd={cart?.addItem} />
                </div>
              ))}
              {!filtered.length ? (
                <div className="col-12">
                  <div className="alert alert-light border mb-0">
                    No products found.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

