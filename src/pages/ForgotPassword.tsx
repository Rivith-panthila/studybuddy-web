import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../service/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setMessage(data.message || "Please check your email for the reset link.");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to send reset link. Try again."
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
          <h1 className="text-3xl font-bold">Forgot password?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Enter your registered email address to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

            {message && (
              <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

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

export default ForgotPassword;