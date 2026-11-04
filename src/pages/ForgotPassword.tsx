import { Link } from "react-router-dom";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";

function ForgotPassword() {
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
          <h1 className="text-3xl font-bold">Forgot password?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Enter your registered email address. We'll send you a link to reset
            your password.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                <Mail size={18} className="text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold hover:bg-blue-500"
            >
              Send Reset Link
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