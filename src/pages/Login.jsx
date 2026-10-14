
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(user.role === "owner" ? "/post-property" : "/search");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to log in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-7 shadow-lg sm:p-9">
        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="rounded-xl bg-blue-600 p-2 text-white">
            <Home size={23} />
          </span>
          <span className="text-2xl font-extrabold">
            Rent<span className="text-blue-600">Khoj</span>
          </span>
        </Link>

        <h1 className="mt-7 text-center text-2xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Log in to find your place in Rourkela.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={updateField}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting && <LoaderCircle size={18} className="animate-spin" />}
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
