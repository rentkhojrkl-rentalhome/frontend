import { useCallback, useEffect, useState } from "react";
import CreateAdminForm from "../../components/superadmin/CreateAdminForm";
import { api } from "../../services/api";

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState([]); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const load = useCallback(async () => { try { setAdmins((await api.get("/super-admin/admins")).data.admins || []); } catch (err) { setError(err.response?.data?.detail || "Unable to load Admin accounts."); } }, []);
  useEffect(() => { load(); }, [load]);
  async function toggle(admin) { try { await api.patch(`/super-admin/admins/${admin.id}/active`, { is_active: !admin.is_active }); setNotice("Admin status updated."); load(); } catch (err) { setError(err.response?.data?.detail || "Unable to update Admin."); } }
  return <section><header className="mb-7"><p className="text-sm font-bold uppercase tracking-widest text-violet-300">Access control</p><h1 className="mt-2 text-3xl font-black text-white">Admins</h1></header><CreateAdminForm onCreated={() => { setNotice("Admin account created successfully."); load(); }} />{error && <p className="mb-4 rounded-xl bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}{notice && <p className="mb-4 rounded-xl bg-emerald-950/40 p-3 text-sm text-emerald-100">{notice}</p>}<div className="space-y-3">{admins.map((admin) => <article key={admin.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4"><div><p className="font-bold text-white">{admin.name}</p><p className="text-sm text-slate-400">{admin.email}</p><p className="mt-1 text-xs text-slate-500">{admin.permissions?.join(", ") || "No permissions"}</p></div><button onClick={() => toggle(admin)} className="rounded-xl border border-white/15 px-3 py-2 text-sm font-bold hover:bg-white/10">{admin.is_active === false ? "Activate" : "Disable"}</button></article>)}{admins.length === 0 && <p className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-400">No Admin accounts exist yet.</p>}</div></section>;
}
