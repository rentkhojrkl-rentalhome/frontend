
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LoaderCircle, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "tenant",
  });

  const [step, setStep] = useState("register");
  const [otp, setOtp] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

      setVerifiedEmail(form.email.trim().toLowerCase());
      setStep("otp");
      setCountdown(60);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/auth/verify-email", {
        email: verifiedEmail,
        otp,
      });

      navigate("/login", {
        replace: true,
        state: { email: verifiedEmail, verified: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "OTP verification failed. Please check the code and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setSubmitting(true);

    try {
      await api.post("/auth/resend-otp", {
        email: verifiedEmail,
      });

      setOtp("");
      setCountdown(60);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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

        {step === "register" ? (
          <>
            <h1 className="mt-7 text-center text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500">
              Join Rourkela's rental community.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

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
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                  Mobile number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  required
                  value={form.phone}
                  onChange={updateField}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a valid Indian mobile number. Property owners can share
                  this with tenants.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={form.password}
                  onChange={updateField}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  I want to join as
                </legend>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "tenant", label: "Tenant", desc: "Find a place" },
                    {
                      value: "owner",
                      label: "Property owner",
                      desc: "List a place",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        form.role === option.value
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={form.role === option.value}
                        onChange={updateField}
                        className="accent-blue-600"
                      />
                      <span className="mt-2 block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {option.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

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
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="mt-8 flex justify-center">
              <span className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                <Mail size={30} />
              </span>
            </div>

            <h1 className="mt-5 text-center text-2xl font-bold text-gray-900">
              Verify your email
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500">
              We've sent a 6-digit code to
            </p>
            <p className="mt-1 break-all text-center text-sm font-semibold text-gray-800">
              {verifiedEmail}
            </p>

            <form onSubmit={handleVerifyOtp} className="mt-7 space-y-5">
              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-semibold">
                  Email verification code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
                />
              </div>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting && <LoaderCircle size={18} className="animate-spin" />}
                {submitting ? "Verifying..." : "Verify email"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              {countdown > 0 ? (
                <span className="font-medium text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={submitting}
                  className="font-semibold text-blue-600 hover:underline disabled:opacity-60"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("register");
                setOtp("");
                setError("");
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to registration
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default Register;
