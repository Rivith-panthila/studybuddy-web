
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { registerUser } from "../service/auth";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password });

      navigate("/login", {
        state: {
          message: "Account created successfully! Please login.",
          email: email,
        },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
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

        {/* Register Card */}
        <div className="rounded-2xl border border-[#E5EBDD] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#374638]">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-[#879183]">
            Join StudyBuddy and organize your learning journey.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">

            {/* Full name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#526052]">
                Full name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#E5EBDD] bg-[#FAFBF8] px-4 focus-within:border-[#718B68] focus-within:ring-2 focus-within:ring-[#DCE8D5]">
                <User size={18} className="text-[#879183]" />

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full bg-transparent py-3.5 text-sm text-[#374638] outline-none placeholder:text-[#A5ADA1]"
                />
              </div>

              <p className="mt-2 text-xs text-[#879183]">
                Password must contain at least 6 characters.
              </p>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-7 text-center text-sm text-[#879183]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#718B68] hover:text-[#526D4D]"
            >
              Sign in
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

export default Register;
