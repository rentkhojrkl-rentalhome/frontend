import { Link, useLocation } from "react-router-dom";
import { Home, User, CircleUserRound, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute left-0 right-0 top-3 z-50 px-3 sm:top-4 sm:px-5"
          : "sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur"
      }
    >
      <div
        className={
          isHome
            ? "mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 rounded-[24px] border border-white/70 bg-white/90 px-4 shadow-[0_10px_40px_rgba(0,0,0,.12)] backdrop-blur-xl sm:min-h-[78px] sm:rounded-full sm:px-7 lg:px-8"
            : "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        }
      >
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="RentKhoj home">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-sm sm:h-11 sm:w-11">
            <MapPin size={22} fill="currentColor" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Rent<span className="text-emerald-700">Khoj</span>
            </div>
            <div className="hidden text-[10px] font-medium text-slate-600 sm:block sm:text-[11px]">
              Find Your Next Home in Rourkela
            </div>
          </div>
        </Link>

        <nav className={isHome ? "hidden items-center gap-1 lg:flex" : "hidden items-center gap-7 md:flex"}>
          {isHome ? (
            <>
              <Link to="/" className="rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white">Home</Link>
              <Link to="/search" className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900">Properties</Link>
              <Link to="/search" className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900">PG / Rooms</Link>
              <Link to="/post-property" className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900">List Property</Link>
              <a href="#why-rentkhoj" className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900">About</a>
              <a href="mailto:rentkhojrkl@gmail.com" className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900">Contact</a>
            </>
          ) : (
            <>
              <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-emerald-700">Find a Place</Link>
              <Link to="/post-property" className="text-sm font-medium text-gray-600 hover:text-emerald-700">List Property</Link>
              <Link to="/requirements" className="text-sm font-medium text-gray-600 hover:text-emerald-700">I Need a Room</Link>
              {user?.role === "admin" && <Link to="/admin" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Admin Dashboard</Link>}
            </>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-500 sm:text-sm">Loading...</span>
          ) : user ? (
            <Link to="/profile" className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 sm:px-5" aria-label="My profile">
              <CircleUserRound size={18} /><span className="hidden sm:inline">Profile</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className={isHome ? "inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 sm:px-6" : "inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"}>
                <User size={17} /> Login
              </Link>
              {!isHome && <Link to="/register" className="hidden rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:inline-flex">Sign up</Link>}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
