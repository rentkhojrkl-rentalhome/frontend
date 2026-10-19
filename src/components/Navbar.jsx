
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  UserRound,
  CircleUserRound,
  MoreVertical,
  X,
  Search,
  Building2,
  BedDouble,
  ShieldCheck,
  Info,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const linkClass = (to) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      pathname === to
        ? "bg-emerald-950 text-white"
        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
    }`;

  return (
    <header
      className={
        isHome
          ? "absolute left-0 right-0 top-3 z-50 px-3 sm:top-4 sm:px-5"
          : "sticky top-0 z-50 border-b border-emerald-950/10 bg-[#f8faf6]/95 px-3 backdrop-blur-xl sm:px-5"
      }
    >
      <div
        className={
          isHome
            ? "relative mx-auto flex min-h-[66px] max-w-7xl items-center justify-between gap-2 rounded-[22px] border border-white/70 bg-white/90 px-3 shadow-[0_10px_40px_rgba(0,0,0,.14)] backdrop-blur-xl sm:min-h-[78px] sm:rounded-full sm:px-6 lg:px-8"
            : "relative mx-auto flex min-h-[66px] max-w-7xl items-center justify-between gap-2 px-1 sm:min-h-[74px] sm:px-1"
        }
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label="RentKhoj home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950 text-white shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl">
            <MapPin size={21} fill="currentColor" strokeWidth={2.2} />
          </span>

          <span className="min-w-0 leading-tight">
            <span className="block whitespace-nowrap text-[19px] font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Rent<span className="text-emerald-700">Khoj</span>
            </span>

            <span className="hidden text-[10px] font-medium text-slate-600 sm:block sm:text-[11px]">
              Find Your Next Home in Rourkela
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link
            to="/"
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              isHome
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            Home
          </Link>

          <Link
            to="/search"
            className={`rounded-full px-4 py-3 text-sm font-medium transition ${
              pathname === "/search"
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            Properties
          </Link>

          <Link
            to="/search?type=PG"
            className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-950"
          >
            PG / Rooms
          </Link>

          <Link
            to="/post-property"
            className={`rounded-full px-4 py-3 text-sm font-medium transition ${
              pathname === "/post-property"
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            List Property
          </Link>

          <Link
            to="/about"
            className={`rounded-full px-4 py-3 text-sm font-medium transition ${
              pathname === "/about"
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`rounded-full px-4 py-3 text-sm font-medium transition ${
              pathname === "/contact"
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            Contact
          </Link>

          <Link
            to="/requirements"
            className={`rounded-full px-3 py-2.5 text-sm font-semibold transition ${
              pathname === "/requirements"
                ? "bg-emerald-950 text-white"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
            }`}
          >
            I Need a Room
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-full px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Profile/Login + mobile three-dot menu */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {loading ? (
            <span className="hidden text-sm text-slate-500 sm:inline">
              Loading...
            </span>
          ) : user ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
              aria-label="My profile"
            >
              <CircleUserRound size={18} />
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              <UserRound size={17} />
              <span>Login</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-emerald-950 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="rentkhoj-mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <MoreVertical size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={closeMenu}
            />

            <nav
              id="rentkhoj-mobile-menu"
              className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-2xl border border-emerald-950/10 bg-[#fbfcf8] p-3 shadow-[0_20px_50px_rgba(0,0,0,.18)] lg:hidden"
            >
              <p className="px-4 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                Explore RentKhoj
              </p>

              <Link to="/" onClick={closeMenu} className={linkClass("/")}>
                <MapPin size={18} />
                Home
              </Link>

              <Link to="/search" onClick={closeMenu} className={linkClass("/search")}>
                <Search size={18} />
                Find Properties
              </Link>

              <Link
                to="/search?type=PG"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-950"
              >
                <BedDouble size={18} />
                PG / Rooms
              </Link>

              <Link
                to="/post-property"
                onClick={closeMenu}
                className={linkClass("/post-property")}
              >
                <Building2 size={18} />
                List Property
              </Link>

              <Link
                to="/requirements"
                onClick={closeMenu}
                className={linkClass("/requirements")}
              >
                <Search size={18} />
                I Need a Room
              </Link>

              <Link to="/about" onClick={closeMenu} className={linkClass("/about")}>
                <Info size={18} />
                About RentKhoj
              </Link>

              <Link to="/contact" onClick={closeMenu} className={linkClass("/contact")}>
                <Mail size={18} />
                Contact
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" onClick={closeMenu} className={linkClass("/admin")}>
                  <ShieldCheck size={18} />
                  Admin Dashboard
                </Link>
              )}

              {!loading && user && (
                <Link to="/profile" onClick={closeMenu} className={linkClass("/profile")}>
                  <CircleUserRound size={18} />
                  My Profile
                </Link>
              )}

              {!loading && !user && (
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-2 flex items-center justify-center rounded-xl border border-emerald-950/15 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50"
                >
                  Create Account
                </Link>
              )}

              <div className="mt-3 rounded-xl bg-emerald-950 px-4 py-3 text-xs leading-5 text-emerald-50">
                Local rentals, made simpler for Rourkela.
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
