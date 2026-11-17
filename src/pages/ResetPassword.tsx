
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

        {/* Reset Password Card */}
        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#374638]">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-[#879183]">
            Create a new password for your account.
          </p>

          {!token ? (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#F0D9D2] bg-[#F9EEEA] p-3 text-sm text-[#B56D62]">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              Invalid reset link. Please request a new password reset email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526052]">
                  New Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 focus-within:border-[#718B68] focus-within:ring-2 focus-within:ring-[#DCE8D5]">
                  <Lock size={18} className="text-[#879183]" />

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526052]">
                  Confirm New Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 focus-within:border-[#718B68] focus-within:ring-2 focus-within:ring-[#DCE8D5]">
                  <Lock size={18} className="text-[#879183]" />

                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-[#F0D9D2] bg-[#F9EEEA] p-3 text-sm text-[#B56D62]">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="flex items-start gap-2 rounded-xl border border-[#DCE8D5] bg-[#EAF2E5] p-3 text-sm text-[#526D4D]">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  {message}
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

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

export default ResetPassword;
