import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import "../../styles/AuthStyles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { api } from "../../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/v1/auth/login", { email, password });

      if (data?.success) {
        // ✅ Save in localStorage
        localStorage.setItem("auth", JSON.stringify(data));

        // ✅ Save in context
        setAuth({
          user: data.user,
          token: data.token,
        });

        toast.success(data.message);

        // 🔥 FINAL FIX (IMPORTANT)
        navigate(location.state || "/");   // ✅ FIXED
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Login Form</h4>

          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOGIN</button>

          <button
            type="button"
            className="btn btn-link p-0 mt-3"
            style={{ textAlign: "left" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;