
import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Home size={20} />
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-gray-900">
              Rent<span className="text-emerald-600">Khoj</span>
            </div>
            <div className="hidden text-[10px] font-medium text-gray-400 sm:block">
              Rourkela's Rental Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
            Find a Place
          </Link>

          <Link to="/post-property" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
            List Property
          </Link>

          <Link to="/requirements" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
            I Need a Room
          </Link>
          {user?.role === "admin" && (
          <Link
                 to="/admin"
               className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Admin Dashboard
          </Link>
                  )}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && user && (
            <Link
              to="/search"
              aria-label="Browse properties"
              className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:block"
            >
              <Heart size={20} />
            </Link>
          )}

          {loading ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs capitalize text-gray-500">{user.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <User size={17} />
                Login
              </Link>

              <Link
                to="/register"
                className="hidden rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
