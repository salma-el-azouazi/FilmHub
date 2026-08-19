import { KeyRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthCinemaStage from "../components/AuthCinemaStage";
import { api } from "../lib/api";

export default function ResetPassword() {
  const { token = "" } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const data = await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      setMessage(data.message);
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    }
  }

  return (
    <AuthCinemaStage
      mode="login"
      title="Create new password"
      subtitle="Use a strong password with at least eight characters. The reset link can be used only once."
    >
      <form onSubmit={submit} className="auth-form-grid">
        <label>
          <span>New password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required />
        </label>
        <label>
          <span>Confirm password</span>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" minLength={8} required />
        </label>
        <button className="auth-primary"><KeyRound size={18} />Reset password</button>
      </form>
      {message && <p className="mt-3 text-sm text-cinema-teal">{message} <Link className="font-bold" to="/login">Login</Link></p>}
      {error && <p className="auth-error">{error}</p>}
    </AuthCinemaStage>
  );
}
