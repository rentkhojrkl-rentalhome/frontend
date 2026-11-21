import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Building2, KeyRound, Database, ClipboardList, ShieldCheck, Archive, ScrollText, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";

const nav = [
  ["", "Overview", LayoutDashboard], ["users", "Users", Users], ["owners", "Owners", Users], ["tenants", "Tenants", Users],
  ["properties", "Properties", Building2], ["rentals", "Rentals", KeyRound], ["admins", "Admins", ShieldCheck],
  ["database", "Database", Database], ["backups", "Backups", Archive], ["reports", "Reports", ClipboardList], ["activity", "Audit logs", ScrollText], ["settings", "Settings", Settings],
];

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  return <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
    <aside className="border-b border-white/10 bg-slate-900 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <Link to="/super-admin" className="flex items-center gap-3 px-3 py-3 text-lg font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600">RK</span><span>Control Center</span></Link>
      <nav className="mt-4 flex gap-1 overflow-x-auto lg:block lg:space-y-1">{nav.map(([to, label, Icon]) => <NavLink end={to === ""} key={to} to={`/super-admin/${to}`} className={({isActive}) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={17}/>{label}</NavLink>)}</nav>
    </aside>
    <div className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-5 py-4 backdrop-blur"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-300">RentKhojRKL</p><p className="text-sm text-slate-300">Super Admin Control Center</p></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-300 sm:block">{user?.name}</span><button onClick={logout} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold hover:bg-white/10">Sign out</button></div></header><main className="p-4 sm:p-6 lg:p-8"><Outlet /></main></div>
  </div>;
}
