import { Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import AuthCinemaStage from "../components/AuthCinemaStage";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const data = await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setMessage(data.message);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      setError(detail === "Failed to fetch" ? "FilmHub API is not reachable. Keep the server running on port 5202 and try again." : detail || "Unable to send reset email");
    }
  }

  return (
    <AuthCinemaStage
      mode="login"
      title="Reset your password"
      subtitle="Enter your account email and FilmHub will send a confirmation email that asks, Is this you?"
    >
      <form onSubmit={submit} className="auth-form-grid">
        <label>
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@filmhub.com" />
        </label>
        <button className="auth-primary"><Send size={18} />Send confirmation email</button>
      </form>
      {message && <p className="mt-3 text-sm text-cinema-teal">{message}</p>}
      {error && <p className="auth-error">{error}</p>}
      <p className="auth-bottom-text">
        Remembered it? <Link to="/login"><Mail size={14} className="inline" /> Login</Link>
      </p>
    </AuthCinemaStage>
  );
}
