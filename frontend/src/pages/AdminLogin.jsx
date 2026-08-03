import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { api, formatApiErrorDetail } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-md border-2 border-paper/25 bg-ink p-8 md:p-10">
        <Link to="/" data-testid="admin-login-brand" className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-tight text-paper">
          <span className="flex h-8 w-8 items-center justify-center bg-brand-red text-paper">
            <Megaphone className="h-4 w-4" />
          </span>
          Buland <span className="text-brand-red">Awaaz</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl font-semibold uppercase tracking-tight text-paper">Team login</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-paper/50">For the Buland Awaaz team only</p>

        <form data-testid="admin-login-form" onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-paper/70">Email</span>
            <input
              data-testid="admin-login-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              className="w-full border-2 border-paper/30 bg-transparent px-4 py-3 text-sm text-paper outline-none focus:border-brand-yellow"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-paper/70">Password</span>
            <input
              data-testid="admin-login-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              className="w-full border-2 border-paper/30 bg-transparent px-4 py-3 text-sm text-paper outline-none focus:border-brand-yellow"
            />
          </label>
          {error && (
            <p data-testid="admin-login-error" role="alert" className="border-2 border-brand-red px-3 py-2 text-sm text-brand-red">
              {error}
            </p>
          )}
          <button
            data-testid="admin-login-submit-button"
            disabled={loading}
            className="border-2 border-brand-red bg-brand-red px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-transparent hover:text-brand-red disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
