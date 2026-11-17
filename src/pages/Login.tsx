
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginUser } from "../service/auth";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();
  const dispatch = useAppDispatch();

  const registrationMessage = location.state?.message;
  const registeredEmail = location.state?.email || "";

  const [email, setEmail] = useState(registeredEmail);
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

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F0] px-5 py-12 text-[#374638]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          to="/"
          className="mb-10 flex items-center justify-center gap-3 text-2xl font-bold text-[#374638]"
        >
          <span className="rounded-xl bg-[#718B68] p-2.5 text-white">
            <BookOpen size={23} />
          </span>
          StudyBuddy
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#374638]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#879183]">
            Sign in to continue your learning journey.
          </p>

          {/* Registration Success Message */}
          {registrationMessage && (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#DCE8D5] bg-[#EAF2E5] p-3 text-sm text-[#526D4D]">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              <span>{registrationMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#526052]">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 focus-within:border-[#718B68] focus-within:ring-2 focus-within:ring-[#DCE8D5]">
                <Mail size={18} className="text-[#879183]" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#526052]">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 focus-within:border-[#718B68] focus-within:ring-2 focus-within:ring-[#DCE8D5]">
                <Lock size={18} className="text-[#879183]" />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#718B68] transition hover:text-[#526D4D]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F0D9D2] bg-[#F9EEEA] p-3 text-sm text-[#B56D62]">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#718B68] py-3.5 font-semibold text-white transition hover:bg-[#5F7957] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-7 text-center text-sm text-[#879183]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#718B68] hover:text-[#526D4D]"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#A0AA9A]">
          StudyBuddy — Learn smarter, achieve more.
        </p>
      </div>
    </main>
  );
}

export default Login;
