import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import { useCart } from "../../context/cart";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  // 🔥 Logout Function
  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });

    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">

        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold">
          ECOMMERCE
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/shop" className="nav-link">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/category" className="nav-link">Categories</NavLink>
            </li>

            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to={auth?.user?.role === 1 ? "/dashboard/admin" : "/dashboard"}
                    className="nav-link"
                  >
                    Dashboard
                  </NavLink>
                </li>
                {/* 🔥 DIRECT LOGOUT BUTTON */}
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </span>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">
                Cart{" "}
                <span className="badge text-bg-dark align-middle">
                  {cart?.count ?? 0}
                </span>
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;