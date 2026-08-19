import { KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCinemaStage from "../components/AuthCinemaStage";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password, remember);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <AuthCinemaStage
      mode="register"
      title="Create your critic profile"
      subtitle="Register as a normal user to publish multimedia posts, comment, follow posters, and bookmark films."
    >
      <form onSubmit={submit} className="auth-form-grid">
        <label>
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required placeholder="you@filmhub.com" />
        </label>
        <label>
          <span>Password</span>
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" minLength={8} required placeholder="At least 8 characters" />
        </label>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <input checked={remember} onChange={(e) => setRemember(e.target.checked)} type="checkbox" className="h-4 w-4 accent-cinema-red" />
          Remember this account
        </div>
        <button className="auth-primary"><UserPlus size={18} />Register</button>
      </form>

      <div className="auth-demo-row">
        <Link to="/login"><KeyRound size={16} /> Login instead</Link>
        <Link to="/admin-login"><ShieldCheck size={16} /> Admin panel</Link>
      </div>

      {error && <p className="auth-error">{error}</p>}
      <p className="auth-bottom-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthCinemaStage>
  );
}
