import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Phone, ShieldCheck, Home, ClipboardList, Save, LoaderCircle, LogOut } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputClass = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50";

export default function Profile() {
  const { user, loading: authLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { state: { from: "/profile" } });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      if (!user) { setLoading(false); return; }
      try {
        const response = await api.get("/auth/me");
        if (active) {
          setForm({ name: response.data.name || "", phone: response.data.phone || "" });
          updateUser(response.data);
        }
      } catch (err) {
        if (active) setError(err.response?.data?.detail || "Could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (!authLoading && user) loadProfile();
    return () => { active = false; };
  }, [authLoading, user?.id]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
    setSuccess("");
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (name.length < 2) { setError("Name must contain at least 2 characters."); return; }
    if (phone && !/^(\+91[6-9]\d{9}|[6-9]\d{9})$/.test(phone.replace(/[\s-]/g, ""))) {
      setError("Enter a valid Indian mobile number or leave it blank."); return;
    }
    setSaving(true);
    try {
      const response = await api.patch("/auth/profile", { name, phone: phone || null });
      updateUser(response.data.user);
      setForm({ name: response.data.user.name || "", phone: response.data.user.phone || "" });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update your profile. Please try again.");
    } finally { setSaving(false); }
  }

  if (authLoading || loading) return <main className="grid min-h-[60vh] place-items-center text-gray-500"><span className="inline-flex items-center gap-2"><LoaderCircle className="animate-spin" size={18}/> Loading profile…</span></main>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7faf7] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#063f2d] via-[#08764d] to-[#b6e879] p-6 text-white shadow-sm sm:p-9">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/30 bg-white/15"><UserRound size={42}/></div>
            <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.18em] text-lime-100">MY RENTKHOJ ACCOUNT</p><h1 className="mt-2 break-words text-3xl font-black">{user.name || "Your Profile"}</h1><p className="mt-2 text-sm text-white/85">Manage your personal details and rental activity.</p></div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-semibold capitalize">{user.role || "Member"}</span>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/25">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-extrabold text-gray-900">Personal information</h2>
            <p className="mt-1 text-sm text-gray-500">Keep your contact details up to date.</p>
            <form onSubmit={saveProfile} className="mt-6 space-y-5">
              <label className="block text-sm font-semibold text-gray-700">Full name<input className={inputClass} name="name" value={form.name} onChange={update} maxLength={100} required /></label>
              <label className="block text-sm font-semibold text-gray-700">Email address<div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17}/><input className={`${inputClass} pl-10 bg-gray-50 text-gray-500`} value={user.email || ""} readOnly /></div><span className="mt-1 block text-xs font-normal text-gray-400">Email changes are not enabled here.</span></label>
              <label className="block text-sm font-semibold text-gray-700">Mobile number <span className="font-normal text-gray-400">(optional)</span><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17}/><input className={`${inputClass} pl-10`} name="phone" type="tel" inputMode="tel" value={form.phone} onChange={update} placeholder="10-digit mobile number" maxLength={13}/></div><span className="mt-1 block text-xs font-normal text-gray-400">Adding a number here does not mean it has been OTP verified.</span></label>
              {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {success && <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
              <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"><Save size={17}/>{saving ? "Saving…" : "Save changes"}</button>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="font-extrabold text-gray-900">Your activity</h2><div className="mt-4 space-y-2"><Link to="/requirements" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"><ClipboardList size={19}/> My room requirements</Link><Link to="/post-property" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"><Home size={19}/> My properties / List property</Link></div></section>
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><ShieldCheck className="text-emerald-700" size={25}/><h2 className="mt-3 font-extrabold text-emerald-950">Keep your account safe</h2><p className="mt-1 text-sm leading-6 text-emerald-900/75">Never share your password or OTP. Your email and phone number should not be shown publicly without your permission.</p></section>
          </aside>
        </div>
      </div>
    </main>
  );
}
