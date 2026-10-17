import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, BedDouble, CalendarDays, CheckCircle2, Clock3,
  Home, MapPin, Plus, RefreshCw, Search, ShieldCheck, Wallet,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  room_type: "Single Room",
  preferred_area: "",
  budget: "",
  move_in: "Within 15 days",
  furnishing: "Any",
  description: "",
};
const inputClass = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50";
const roomTypes = ["Single Room", "Shared Room", "Flat", "PG", "1 BHK", "2 BHK"];

function formatDate(value) {
  if (!value) return "Recently posted";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently posted" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function statusClass(status) {
  const value = String(status || "open").toLowerCase();
  if (["closed", "fulfilled", "inactive"].includes(value)) return "bg-gray-100 text-gray-600";
  return "bg-emerald-50 text-emerald-700";
}

export default function Requirements() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [requirements, setRequirements] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("matches");

  const loadData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const [mineResult, propertyResult] = await Promise.allSettled([
        api.get("/requirements/mine"),
        api.get("/properties"),
      ]);
      if (mineResult.status === "fulfilled") {
        const data = mineResult.value.data;
        setRequirements(Array.isArray(data) ? data : data.requirements || []);
      } else {
        const status = mineResult.reason?.response?.status;
        setError(status === 404
          ? "The room-requirements API is not installed on the backend yet. Add the backend router included with this feature ZIP."
          : mineResult.reason?.response?.data?.detail || "Could not load your requirements.");
      }
      if (propertyResult.status === "fulfilled") {
        const data = propertyResult.value.data;
        setProperties(Array.isArray(data) ? data : data.properties || []);
      }
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (!authLoading) loadData(); }, [authLoading, loadData]);

  const matches = useMemo(() => {
    const active = requirements[0];
    if (!active) return [];
    const area = String(active.preferred_area || "").trim().toLowerCase();
    const type = String(active.room_type || "").toLowerCase();
    const budget = Number(active.budget || 0);
    return properties.filter((p) => {
      const status = String(p.status || "approved").toLowerCase();
      if (["pending", "rejected", "inactive", "deleted"].includes(status)) return false;
      const rent = Number(p.monthly_rent ?? p.rent ?? p.price ?? 0);
      const pType = String(p.property_type || p.type || "").toLowerCase();
      const pArea = [p.area, p.location, p.address, p.city].filter(Boolean).join(" ").toLowerCase();
      const areaMatch = !area || pArea.includes(area) || area.split(/[ ,]+/).some((part) => part.length > 2 && pArea.includes(part));
      const typeMatch = !type || type === "any" || pType.includes(type.replace("single room", "room").replace("shared room", "room")) || (type === "pg" && pType.includes("pg")) || (type.includes("bhk") && String(p.title || "").toLowerCase().includes(type));
      const budgetMatch = !budget || (rent > 0 && rent <= budget);
      return areaMatch && typeMatch && budgetMatch;
    }).slice(0, 12);
  }, [requirements, properties]);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault(); setError(""); setSuccess("");
    if (!user) { navigate("/login", { state: { from: "/requirements" } }); return; }
    const area = form.preferred_area.trim();
    const budget = Number(form.budget);
    if (area.length < 2) { setError("Enter your preferred area in Rourkela."); return; }
    if (!Number.isFinite(budget) || budget < 500 || budget > 1000000) { setError("Enter a monthly budget between ₹500 and ₹10,00,000."); return; }
    setSubmitting(true);
    try {
      
      
const payload = {
  room_type: form.room_type,
  area: area,
  monthly_budget: budget,
  move_in: form.move_in,
  furnishing: form.furnishing,
  notes: form.description.trim() || null,
};

await api.post("/requirements", payload);

      await api.post("/requirements", payload);
      setForm(initialForm);
      setSuccess("Your room requirement was posted successfully.");
      setTab("mine");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not post your requirement. Please check the backend API and try again.");
    } finally { setSubmitting(false); }
  }

  async function closeRequirement(id) {
    setError(""); setSuccess("");
    try {
      await api.patch(`/requirements/${id}`, { status: "closed" });
      setSuccess("Requirement closed.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update this requirement. Check that the backend supports requirement updates.");
    }
  }

  if (authLoading) return <main className="min-h-[65vh] grid place-items-center text-gray-500">Checking your account…</main>;

  return (
    <main className="min-h-screen bg-[#f7faf7] pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#063f2d] via-[#08764d] to-[#b6e879] px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.3fr_.7fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold"><MapPin size={14}/> MADE FOR ROURKELA</span>
            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Tell us what you need. <span className="text-lime-200">Find your next room.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">Share your budget, preferred area and move-in timeline. RentKhoj will help you discover relevant available listings.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-white/90 sm:text-sm"><span className="flex items-center gap-2"><ShieldCheck size={16}/> Your account</span><span className="flex items-center gap-2"><Search size={16}/> Matching listings</span><span className="flex items-center gap-2"><Wallet size={16}/> Budget-based search</span></div>
          </div>
          <div className="hidden justify-self-center rounded-[2rem] border border-white/30 bg-white/10 p-5 shadow-2xl backdrop-blur-sm md:block"><div className="grid h-44 w-44 place-items-center rounded-[1.5rem] bg-white text-emerald-800"><Home size={76} strokeWidth={1.5}/></div><p className="mt-3 text-center text-sm font-bold">Your next home starts here</p></div>
        </div>
      </section>

      <div className="mx-auto -mt-5 max-w-6xl px-4 sm:px-6">
        {!user ? <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg sm:p-8"><h2 className="text-xl font-bold text-gray-900">Login to post your room requirement</h2><p className="mt-2 text-sm text-gray-600">Sign in to save your requirement, see matching listings and manage responses.</p><Link to="/login" state={{ from: "/requirements" }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Login to continue <ArrowRight size={16}/></Link></section> : <>
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">ROOM REQUIREMENT</p><h2 className="mt-2 text-2xl font-extrabold text-gray-900">What are you looking for?</h2><p className="mt-1 text-sm text-gray-500">Fields marked * are required.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"><ShieldCheck size={15}/> Posted to your account</span></div>
            <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">Room type *<select className={inputClass} name="room_type" value={form.room_type} onChange={update}>{roomTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="block text-sm font-semibold text-gray-700">Preferred area *<input className={inputClass} name="preferred_area" value={form.preferred_area} onChange={update} placeholder="e.g. Sector 3, Civil Township" maxLength={100} required /></label>
              <label className="block text-sm font-semibold text-gray-700">Monthly budget (₹) *<input className={inputClass} name="budget" type="number" min="500" max="1000000" step="100" value={form.budget} onChange={update} placeholder="e.g. 6000" required /></label>
              <label className="block text-sm font-semibold text-gray-700">Move-in timeline *<select className={inputClass} name="move_in" value={form.move_in} onChange={update}><option>Immediately</option><option>Within 7 days</option><option>Within 15 days</option><option>Within a month</option><option>Flexible</option></select></label>
              <label className="block text-sm font-semibold text-gray-700">Furnishing preference<select className={inputClass} name="furnishing" value={form.furnishing} onChange={update}><option>Any</option><option>Furnished</option><option>Semi-furnished</option><option>Unfurnished</option></select></label>
              <label className="block text-sm font-semibold text-gray-700">Additional details <span className="font-normal text-gray-400">(optional)</span><textarea className={inputClass} name="description" value={form.description} onChange={update} placeholder="Share preferences such as attached bathroom, parking, etc." rows={3} maxLength={500}/></label>
              {error && <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</div>}
              {success && <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800 md:col-span-2">{success}</div>}
              <div className="flex flex-col gap-3 sm:flex-row md:col-span-2"><button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"><Plus size={17}/>{submitting ? "Posting requirement…" : "Post my requirement"}</button><button type="button" onClick={() => { setForm(initialForm); setError(""); setSuccess(""); }} className="rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Clear form</button></div>
            </form>
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-gray-900">Your room dashboard</h2><p className="mt-1 text-sm text-gray-500">Manage your requirements and browse relevant listings.</p></div><button onClick={loadData} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"><RefreshCw size={15}/> Refresh</button></div>
            <div className="mt-4 flex gap-2 border-b border-gray-200"><button onClick={() => setTab("matches")} className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "matches" ? "border-emerald-700 text-emerald-800" : "border-transparent text-gray-500"}`}>Matching properties</button><button onClick={() => setTab("mine")} className={`border-b-2 px-4 py-3 text-sm font-bold ${tab === "mine" ? "border-emerald-700 text-emerald-800" : "border-transparent text-gray-500"}`}>My requirements ({requirements.length})</button></div>
            {loading ? <div className="py-12 text-center text-sm text-gray-500">Loading your room dashboard…</div> : tab === "mine" ? <div className="mt-4 grid gap-4">{requirements.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center"><BedDouble className="mx-auto text-emerald-700" size={34}/><h3 className="mt-3 font-bold text-gray-900">No requirements posted yet</h3><p className="mt-1 text-sm text-gray-500">Fill the form above to tell landlords what you need.</p></div> : requirements.map((item) => <article key={item.id || item._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(item.status)}`}>{item.status || "open"}</span><h3 className="mt-3 text-lg font-extrabold text-gray-900">{item.room_type || "Room"} · ₹{Number(item.budget || 0).toLocaleString("en-IN")}/month</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500"><MapPin size={15}/>{item.preferred_area}, Rourkela</p></div><div className="text-xs text-gray-400">{formatDate(item.created_at)}</div></div><div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/>{item.move_in || "Flexible"}</span><span>{item.furnishing || "Any furnishing"}</span></div>{item.status !== "closed" && <button onClick={() => closeRequirement(item.id || item._id)} className="mt-4 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">Close requirement</button>}</article>)}</div> : <div className="mt-4">{error && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}{matches.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center"><Search className="mx-auto text-emerald-700" size={34}/><h3 className="mt-3 font-bold text-gray-900">Your matches will appear here</h3><p className="mt-1 text-sm text-gray-500">Post a requirement first. Matching uses your latest requirement's area, room type and budget.</p><Link to="/search" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Browse all properties <ArrowRight size={15}/></Link></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{matches.map((p) => { const id = p.id || p._id; const image = p.image_urls?.[0] || p.images?.[0] || p.image_url; const rent = p.monthly_rent ?? p.rent ?? p.price; return <article key={id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">{image ? <img src={image} alt={p.title || "Rental property"} className="h-44 w-full object-cover" loading="lazy"/> : <div className="grid h-44 place-items-center bg-emerald-50 text-emerald-700"><Home size={42}/></div>}<div className="p-4"><p className="text-lg font-extrabold text-emerald-800">₹{Number(rent || 0).toLocaleString("en-IN")}<span className="text-xs font-medium text-gray-500"> / month</span></p><h3 className="mt-1 font-bold text-gray-900">{p.title || p.property_type || "Rental property"}</h3><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={13}/>{[p.area, p.location, p.address].filter(Boolean).join(", ") || "Rourkela"}</p><Link to={`/properties/${id}`} className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">View property <ArrowRight size={15}/></Link></div></article>; })}</div>}</div>}
          </section>
        </>}
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl items-center gap-2 px-4 text-xs text-gray-500 sm:px-6"><Clock3 size={14}/> Keep your requirement updated so you can find a suitable room sooner.</div>
    </main>
  );
}
