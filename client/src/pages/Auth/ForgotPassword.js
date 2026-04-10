import React, { useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "../../styles/AuthStyles.css";
import { toast } from "react-hot-toast";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (step === 1) return "Forgot Password";
    if (step === 2) return "Enter OTP";
    return "Create New Password";
  }, [step]);

  const requestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/auth/forgot-password", { email });
      if (data?.success) {
        setServerOtp(String(data.otp || ""));
        toast.success("OTP generated");
        setStep(2);
      } else {
        toast.error(data?.message || "Failed to generate OTP");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to generate OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/auth/verify-otp", { email, otp });
      if (data?.success) {
        setResetToken(data.resetToken);
        toast.success("OTP verified");
        setStep(3);
      } else {
        toast.error(data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/auth/reset-password", {
        resetToken,
        newPassword,
      });
      if (data?.success) {
        toast.success("Password updated. Please login.");
        navigate("/login");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        {step === 1 ? (
          <form onSubmit={requestOtp}>
            <h4 className="title">{title}</h4>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Generate OTP"}
            </button>
          </form>
        ) : null}

        {step === 2 ? (
          <form onSubmit={verifyOtp}>
            <h4 className="title">{title}</h4>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Demo requirement: show OTP on screen */}
            <div className="alert alert-warning mt-2 mb-3">
              <div className="fw-semibold">Demo OTP (auto-generated)</div>
              <div style={{ letterSpacing: 2, fontWeight: 700, fontSize: 18 }}>
                {serverOtp || "—"}
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="btn btn-link p-0 mt-3"
              style={{ textAlign: "left" }}
              onClick={() => setStep(1)}
            >
              Change email
            </button>
          </form>
        ) : null}

        {step === 3 ? (
          <form onSubmit={resetPassword}>
            <h4 className="title">{title}</h4>
            <input
              type="password"
              placeholder="Create new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : null}
      </div>
    </Layout>
  );
}

