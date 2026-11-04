import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, Lock, ArrowLeft } from "lucide-react";
import { resetPassword } from "../service/auth";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(token, password);
      setMessage(data.message || "Password reset successful!");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Password reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d1b] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-10 flex items-center justify-center gap-2 text-2xl font-bold"
        >
          <span className="rounded-xl bg-blue-600 p-2">
            <BookOpen size={23} />
          </span>
          StudyBuddy
        </Link>

        <div className="rounded-2xl border border-slate-700/70 bg-[#111a2d] p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create a new password for your account.
          </p>

          {!token ? (
            <p className="mt-6 text-sm text-red-400">
              Invalid reset link. Please request a new password reset email.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                  <Lock size={18} className="text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                  <Lock size={18} className="text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;