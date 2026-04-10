import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { productPlaceholder } from "../lib/images";
import { api } from "../lib/api";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function CategoryPage() {
  const query = useQuery();
  const selected = query.get("c");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: cat }, { data: prod }] = await Promise.all([
          api.get("/api/v1/category"),
          api.get("/api/v1/product"),
        ]);
        setCategories(cat?.categories || []);
        const list = (prod?.products || []).map((p) => ({
          ...p,
          id: p._id,
          categoryName: p.category?.name || "",
        }));
        setProducts(list);
      } catch {
        // ignore
      }
    };
    load();
  }, []);
  const productsByCategory = useMemo(() => {
    if (!selected) return {};
    return {
      [selected]: products.filter((p) => p.categoryName === selected),
    };
  }, [selected, products]);

  return (
    <Layout>
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
          <div>
            <h3 className="mb-1">Categories</h3>
            <div className="text-muted">Pick a category to explore.</div>
          </div>
          <Link to="/shop" className="btn btn-outline-dark btn-sm">
            Browse all products
          </Link>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-4">
              <div className="list-group shadow-sm">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/category?c=${encodeURIComponent(c.name)}`}
                  className={`list-group-item list-group-item-action ${
                    selected === c.name ? "active" : ""
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-8">
            {!selected ? (
              <div className="alert alert-light border">
                Select a category from the left.
              </div>
            ) : (
              <div className="bg-white border rounded-4 p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">{selected}</h5>
                  <span className="text-muted small">
                    {productsByCategory[selected]?.length ?? 0} items
                  </span>
                </div>
                <div className="row g-3">
                  {productsByCategory[selected]?.map((p) => (
                    <div className="col-12 col-md-6" key={p.id}>
                      <div className="border rounded-4 p-3 h-100">
                        <div className="d-flex gap-3">
                          <img
                            src={p.image}
                            width="84"
                            height="84"
                            alt={p.name}
                            className="rounded-3 object-fit-cover"
                            onError={(e) => {
                              const el = e.currentTarget;
                              if (el?.dataset?.fallbackApplied) return;
                              if (el?.dataset) el.dataset.fallbackApplied = "1";
                              el.src = productPlaceholder(p.name);
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{p.name}</div>
                            <div className="text-muted small mb-2">
                              ₹{p.price} • {p.rating}/5
                            </div>
                            <Link
                              to={`/product/${p.id}`}
                              className="btn btn-outline-dark btn-sm"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!productsByCategory[selected]?.length ? (
                    <div className="col-12">
                      <div className="alert alert-light border mb-0">
                        No products in this category.
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

