import { useState } from "react";
import { UserPlus } from "lucide-react";
import { api } from "../../services/api";

const permissions = [
  ["properties.view", "View properties"], ["properties.review", "Review properties"],
  ["users.view", "View users"], ["users.manage", "Manage users"],
  ["owners.verify", "Verify owners"], ["rentals.view", "View rentals"],
  ["rentals.manage", "Manage rentals"], ["reports.view", "View reports"],
  ["activity.view", "View audit logs"], ["database.export", "Export data"], ["database.backup", "Manage backups"],
];

export default function CreateAdminForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", permissions: ["properties.view", "properties.review"] });
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  function toggle(permission) { setForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] })); }
  async function submit(event) { event.preventDefault(); setSaving(true); setError(""); try { await api.post("/super-admin/admins", form); setForm({ name: "", email: "", password: "", permissions: ["properties.view", "properties.review"] }); onCreated(); } catch (err) { setError(err.response?.data?.detail || "Could not create this Admin account."); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="mb-6 rounded-2xl border border-violet-400/20 bg-violet-950/20 p-5"><div className="flex items-center gap-2"><UserPlus size={20} className="text-violet-300"/><h2 className="font-bold text-white">Create Admin account</h2></div><p className="mt-1 text-sm text-slate-400">Choose only the permissions this person needs. They can be changed later.</p>{error && <p className="mt-4 rounded-lg bg-red-950/50 p-3 text-sm text-red-200">{error}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-3"><input required minLength="2" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Full name" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-violet-400"/><input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="admin@example.com" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-violet-400"/><input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Temporary password" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-violet-400"/></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{permissions.map(([value, label]) => <label key={value} className="flex items-center gap-2 rounded-lg bg-slate-950/60 px-3 py-2 text-sm text-slate-300"><input type="checkbox" checked={form.permissions.includes(value)} onChange={() => toggle(value)} />{label}</label>)}</div><button disabled={saving} className="mt-5 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-500 disabled:opacity-60">{saving ? "Creating…" : "Create Admin"}</button></form>;
}
