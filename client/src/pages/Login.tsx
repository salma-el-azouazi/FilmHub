import { KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCinemaStage from "../components/AuthCinemaStage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@filmhub.test");
  const [password, setPassword] = useState("FilmHub123!");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password, remember);
      navigate(email.toLowerCase().startsWith("admin") ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <AuthCinemaStage
      mode="login"
      title="Login to FilmHub"
      subtitle="Use the demo admin account or your registered profile to enter the platform."
    >
      <form onSubmit={submit} className="auth-form-grid">
        <label>
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="admin@filmhub.test" />
        </label>
        <label>
          <span>Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="FilmHub123!" />
        </label>
        <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input checked={remember} onChange={(e) => setRemember(e.target.checked)} type="checkbox" className="h-4 w-4 accent-cinema-red" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-bold text-cinema-teal">Forgot password?</Link>
        </div>
        <button className="auth-primary"><KeyRound size={18} />Login</button>
      </form>

      <div className="auth-demo-row">
        <button type="button" onClick={() => { setEmail("admin@filmhub.test"); setPassword("FilmHub123!"); }}>
          <ShieldCheck size={16} /> Admin demo
        </button>
        <button type="button" onClick={() => { setEmail("maya@filmhub.test"); setPassword("FilmHub123!"); }}>
          <UserPlus size={16} /> User demo
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}
      <p className="auth-bottom-text">
        No account yet? <Link to="/register">Create one</Link>
      </p>
    </AuthCinemaStage>
  );
}
