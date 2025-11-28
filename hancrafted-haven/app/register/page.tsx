"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Registration successful! You can login now.");
      setShowPopup(true); // Show the popup
    } else {
      setMessage(data.error);
    }
  }

  return (
    <main className="register-page">
      <div className="register-card">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Image
              src={showPassword ? "/images/eye-close.svg" : "/images/eye-opened.png"}
              alt="Toggle password visibility"
              width={22}
              height={22}
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Register</button>
        </form>

        {/* Mesaj erè/siksè anba fòm */}
        {message && !showPopup && (
          <p className={message.includes("successful") ? "success" : "error"}>
            {message}
          </p>
        )}

        <div className="mt-4">
          <p className="mb-2">Already have an account?</p>
          <button
            onClick={() => router.push("/login")}
            className="secondary"
          >
            Login
          </button>
        </div>
      </div>

      {/* Popup modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Success!</h2>
            <p>{message}</p>
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={() => {
                  setShowPopup(false);
                  router.push("/login");
                }}
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowPopup(false)}
                style={{ backgroundColor: "#dc2626" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}