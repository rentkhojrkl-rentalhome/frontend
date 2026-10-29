
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Home,
  ClipboardList,
  Save,
  LoaderCircle,
  LogOut,
  Camera,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50";

export default function Profile() {
  const { user, loading: authLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        state: { from: "/profile" },
        replace: true,
      });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const currentUser = response.data;

        if (active) {
          setForm({
            name: currentUser.name || "",
            phone: currentUser.phone || "",
          });
          setProfilePhoto(currentUser.profile_photo_url || "");
          updateUser(currentUser);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Could not load your profile."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (!authLoading && user) {
      loadProfile();
    }

    return () => {
      active = false;
    };
  }, [authLoading, user?.id, updateUser]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setSuccess("");
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const phone = form.phone.trim().replace(/[\s-]/g, "");

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (
      phone &&
      !/^(\+91[6-9]\d{9}|[6-9]\d{9})$/.test(phone)
    ) {
      setError(
        "Enter a valid Indian mobile number or leave it blank."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await api.patch("/auth/profile", {
        name,
        phone: phone || null,
      });

      // Backend returns { message, user }.
      const updatedUser = response.data.user;

      updateUser(updatedUser);
      setForm({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
      });
      setProfilePhoto(updatedUser.profile_photo_url || "");

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again.
    event.target.value = "";

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingPhoto(true);

    try {
      const response = await api.post(
        "/auth/profile/photo",
        formData,
        {
          // Override the JSON default on the shared Axios instance.
          // Axios/browser will set the multipart boundary.
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const photoUrl = response.data?.profile_photo_url;

      if (!photoUrl) {
        throw new Error(
          "The server did not return a profile photo URL."
        );
      }

      setProfilePhoto(photoUrl);

      // Keep the shared auth context in sync.
      updateUser({
        ...user,
        profile_photo_url: photoUrl,
      });

      setSuccess("Profile photo updated successfully.");
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (err.response?.status === 404) {
        setError(
          "Photo upload endpoint is missing from the backend. Add POST /api/auth/profile/photo to app/auth.py."
        );
      } else if (err.response?.status === 422) {
        setError(
          typeof detail === "string"
            ? detail
            : "The backend rejected the upload data. Check the response detail and ensure the endpoint expects a file field named 'file'."
        );
      } else {
        setError(
          (typeof detail === "string" && detail) ||
            err.message ||
            "Photo upload failed. Please try again."
        );
      }
    } finally {
      setUploadingPhoto(false);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center text-gray-500">
        <span className="inline-flex items-center gap-2">
          <LoaderCircle className="animate-spin" size={18} />
          Loading profile…
        </span>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7faf7] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#063f2d] via-[#08764d] to-[#b6e879] p-6 text-white shadow-sm sm:p-9">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl border border-white/40 object-cover shadow-sm"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-2xl border border-white/30 bg-white/15">
                  <UserRound size={42} />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                aria-label="Change profile photo"
                className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white text-emerald-800 shadow transition hover:bg-emerald-50 disabled:opacity-60"
              >
                {uploadingPhoto ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Camera size={18} />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-lime-100">
                MY RENTKHOJ ACCOUNT
              </p>

              <h1 className="mt-2 break-words text-3xl font-black">
                {user.name || "Your Profile"}
              </h1>

              <p className="mt-2 break-all text-sm text-white/85">
                {user.email}
              </p>

              <p className="mt-2 text-xs text-white/80">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-semibold capitalize">
                {user.role || "Member"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/25"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-extrabold text-gray-900">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep your contact details up to date.
            </p>

            <form onSubmit={saveProfile} className="mt-6 space-y-5">
              <label className="block text-sm font-semibold text-gray-700">
                Full name
                <input
                  className={inputClass}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Email address
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    className={`${inputClass} bg-gray-50 pl-10 text-gray-500`}
                    value={user.email || ""}
                    readOnly
                  />
                </div>
                <span className="mt-1 block text-xs font-normal text-gray-400">
                  Email changes are not enabled here.
                </span>
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Mobile number{" "}
                <span className="font-normal text-gray-400">
                  (optional)
                </span>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    className={`${inputClass} pl-10`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={16}
                  />
                </div>
                <span className="mt-1 block text-xs font-normal text-gray-400">
                  Enter a valid Indian mobile number.
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-extrabold text-gray-900">
                Your activity
              </h2>

              <div className="mt-4 space-y-2">
                <Link
                  to="/requirements"
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <ClipboardList size={19} />
                  My room requirements
                </Link>

                <Link
                  to="/post-property"
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Home size={19} />
                  My properties / List property
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <ShieldCheck
                className="text-emerald-700"
                size={25}
              />
              <h2 className="mt-3 font-extrabold text-emerald-950">
                Keep your account safe
              </h2>
              <p className="mt-1 text-sm leading-6 text-emerald-900/75">
                Never share your password or OTP. Only upload a
                profile photo you have permission to use.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
