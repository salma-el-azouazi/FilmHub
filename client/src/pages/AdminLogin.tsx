import { KeyRound, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCinemaStage from "../components/AuthCinemaStage";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@filmhub.test");
  const [password, setPassword] = useState("FilmHub123!");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      logout();
      await login(email, password);
      const storedUser = JSON.parse(localStorage.getItem("filmhub_user") || "{}") as { role?: string };
      if (storedUser.role !== "admin") {
        setError("This account is not an administrator account.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    }
  }

  return (
    <AuthCinemaStage
      mode="admin"
      title="Admin Login"
      subtitle="Enter administrator credentials to unlock full FilmHub control: users, posts, categories, comments, analytics, and broadcasts."
    >
      <form onSubmit={submit} className="auth-form-grid">
        <label>
          <span>Admin email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="admin@filmhub.test" />
        </label>
        <label>
          <span>Admin password</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required placeholder="FilmHub123!" />
        </label>
        <button className="auth-primary"><ShieldCheck size={18} />Enter Admin Space</button>
      </form>

      <div className="auth-demo-row">
        <button type="button" onClick={() => { setEmail("admin@filmhub.test"); setPassword("FilmHub123!"); }}>
          <KeyRound size={16} /> Fill demo admin
        </button>
        <Link to="/login">Normal login</Link>
      </div>

      <div className="admin-credential-box">
        <b>Demo admin information</b>
        <span>Email: admin@filmhub.test</span>
        <span>Password: FilmHub123!</span>
      </div>

      {error && <p className="auth-error">{error}</p>}
    </AuthCinemaStage>
  );
}
