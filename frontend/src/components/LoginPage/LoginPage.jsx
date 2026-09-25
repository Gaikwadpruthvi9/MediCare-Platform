import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Stethoscope } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/logo.png";
import { loginPageStyles, toastStyles } from "../../assets/dummyStyles";
import { API_BASE } from "../../config/api";

const STORAGE_KEY = "doctorToken_v1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }

      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId =
        json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id;
      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token }),
      );
      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast,
      });

      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={loginPageStyles.mainContainer}>
      <Toaster position="top-right" />

      {/* Back button */}
      <Link to="/" className={loginPageStyles.backButton}>
        <ArrowLeft className={loginPageStyles.backButtonIcon} />
        <span>Back to Home</span>
      </Link>

      <div className={loginPageStyles.loginCard}>
        {/* Logo */}
        <div className={loginPageStyles.logoContainer}>
          <img
            src={logo}
            alt="MediCare Logo"
            className={loginPageStyles.logo}
          />
        </div>

        <h2 className={loginPageStyles.title}>Doctor Portal</h2>
        <p className={loginPageStyles.subtitle}>
          Sign in to manage your appointments, schedule, and patient records
        </p>

        <form onSubmit={handleSubmit} className={loginPageStyles.form}>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-emerald-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                className={`${loginPageStyles.input} pl-12 text-sm text-gray-800`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-emerald-500 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${loginPageStyles.input} pl-12 text-sm text-gray-800`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`${loginPageStyles.submitButton} cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>{busy ? "Signing In..." : "Sign In to Dashboard"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}