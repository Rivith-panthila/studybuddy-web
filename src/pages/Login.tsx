
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "../service/auth";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      login(data.user, data.accessToken);

      dispatch(
        loginSuccess({
          user: data.user,
          accessToken: data.accessToken,
        })
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d1b] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2 text-2xl font-bold">
          <span className="rounded-xl bg-blue-600 p-2">
            <BookOpen size={23} />
          </span>
          StudyBuddy
        </Link>

        <div className="rounded-2xl border border-slate-700/70 bg-[#111a2d] p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue your learning journey.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                <Mail size={18} className="text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                <Lock size={18} className="text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
