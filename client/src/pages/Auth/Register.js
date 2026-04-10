import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import "../../styles/AuthStyles.css"; // ✅ important
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../lib/api";
import { useAuth } from "../../context/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("0"); // "0" = user, "1" = admin
  const navigate = useNavigate();
  const [, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        role: Number(role),
      });

      if (res && res.data.success) {
        toast.success(res.data.message);

        // If admin selected, auto login and go to admin dashboard
        if (role === "1") {
          try {
            const { data: loginData } = await api.post("/api/v1/auth/login", {
              email,
              password,
            });
            if (loginData?.success) {
              setAuth({
                user: loginData.user,
                token: loginData.token,
              });
              localStorage.setItem("auth", JSON.stringify(loginData));
              navigate("/dashboard/admin");
              return;
            }
          } catch (e) {
            // fall back to normal login page
          }
        }

        // normal user or fallback
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("ERROR 👉", error.response || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>

          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <input
            type="text"
            placeholder="Enter Your Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Enter Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <label className="mt-2 mb-1 small text-muted">Account type</label>
          <select
            className="form-select mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>

          <button type="submit">REGISTER</button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;