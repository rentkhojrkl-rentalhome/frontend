
import { Link } from "react-router-dom";
import { Home, MapPin, Mail,  ExternalLink  } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-500 p-3 text-white">
                <Home size={22} />
              </span>
              <span className="text-2xl font-bold text-white">
                Rent<span className="text-emerald-400">Khoj</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Find your next home with ease. Discover rental rooms, flats and
              houses across Rourkela, Odisha.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <MapPin size={17} className="text-emerald-400" />
              Rourkela, Odisha, India
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-emerald-400">Home</Link></li>
              <li><Link to="/search" className="hover:text-emerald-400">Find a Property</Link></li>
              <li><Link to="/post-property" className="hover:text-emerald-400">List Your Property</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Your Account</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="hover:text-emerald-400">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Get in Touch</h3>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Have a question? Contact the RentKhoj team.
            </p>
            <a
              href="mailto:rentkhojrkl@gmail.com"
              className="flex items-center gap-2 text-sm hover:text-emerald-400"
            >
              <Mail size={17} />
              Email Support
            </a>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/rentkhojrkl?vrfl=MTVkNWJ1MXk3a3Zjaw%3D%3D"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-lg border border-slate-700 p-2 hover:text-emerald-400"
              >
                 <ExternalLink size={19} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595351315742"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-lg border border-slate-700 p-2 hover:text-emerald-400"
              >
                <ExternalLink size={19} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} ShunyaLabs Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
