import { Link } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0b1323] px-4">
                <Lock size={18} className="text-slate-500" />
                <input
                  type="password"
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

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-semibold hover:bg-blue-500"
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} StudyBuddy
        </p>
      </div>
    </main>
  );
}

export default Login;