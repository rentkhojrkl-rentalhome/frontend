
import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });
      setMessage(
        response.data?.message ||
          "If an account exists, a reset link will be sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to send the reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <KeyRound size={28} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the email associated with your RentKhojRKL account.
          We’ll send you a password-reset link if the account is eligible.
        </p>

        {message ? (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={20} className="shrink-0" />
              <p>{message}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 focus-within:border-blue-500">
                <Mail size={19} className="text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </main>
  );
}
