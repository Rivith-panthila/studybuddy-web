
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

        {/* Forgot Password Card */}
        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#374638]">
            Forgot password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#879183]">
            Enter your registered email address to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

            {message && (
              <div className="flex items-start gap-2 rounded-xl border border-[#DCE8D5] bg-[#EAF2E5] p-3 text-sm text-[#526D4D]">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                {message}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-[#F0D9D2] bg-[#F9EEEA] p-3 text-sm text-[#B56D62]">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#718B68] py-3.5 font-semibold text-white transition hover:bg-[#5F7957] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-[#718B68] hover:text-[#526D4D] transition"
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
