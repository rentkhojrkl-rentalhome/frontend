import { Link } from "react-router-dom";
import { Home, MapPin, Mail, ArrowUpRight } from "lucide-react";

function InstagramIcon({ size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>;
}
function FacebookIcon({ size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z"/></svg>;
}
export default function Footer() {
  return <footer className="mt-0 bg-[#062f24] text-emerald-50">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="RentKhoj home"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime-200 text-emerald-950"><Home size={22}/></span><span className="text-2xl font-black text-white">Rent<span className="text-lime-300">Khoj</span></span></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/70">Find your next home with ease. Explore rental rooms, flats and houses across Rourkela, Odisha.</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-emerald-50/80"><MapPin size={17} className="text-lime-300"/>Rourkela, Odisha, India</p>
        </div>
        <div><h3 className="font-extrabold text-white">Explore</h3><ul className="mt-4 space-y-3 text-sm text-emerald-50/70"><li><Link to="/" className="hover:text-lime-200">Home</Link></li><li><Link to="/search" className="hover:text-lime-200">Properties</Link></li><li><Link to="/search?type=PG" className="hover:text-lime-200">PG / Rooms</Link></li><li><Link to="/requirements" className="hover:text-lime-200">I Need a Room</Link></li></ul></div>
        <div><h3 className="font-extrabold text-white">Property owners</h3><ul className="mt-4 space-y-3 text-sm text-emerald-50/70"><li><Link to="/post-property" className="hover:text-lime-200">List your property</Link></li><li><Link to="/register" className="hover:text-lime-200">Create account</Link></li><li><Link to="/login" className="hover:text-lime-200">Sign in</Link></li><li><Link to="/about" className="hover:text-lime-200">About RentKhoj</Link></li></ul></div>
        <div><h3 className="font-extrabold text-white">Get in touch</h3><p className="mt-4 text-sm leading-6 text-emerald-50/70">Questions about RentKhoj RKL? Send us a message.</p><a href="mailto:rentkhojrkl@gmail.com" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-lime-200 hover:text-white"><Mail size={17}/> rentkhojrkl@gmail.com <ArrowUpRight size={15}/></a><Link to="/contact" className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-white hover:text-lime-200">Contact page <ArrowUpRight size={15}/></Link><div className="mt-5 flex gap-3"><a href="https://www.instagram.com/rentkhojrkl/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="rounded-xl border border-white/15 p-2.5 text-white/80 transition hover:border-lime-200 hover:text-lime-200"><InstagramIcon/></a><a href="https://www.facebook.com/profile.php?id=61595351315742" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="rounded-xl border border-white/15 p-2.5 text-white/80 transition hover:border-lime-200 hover:text-lime-200"><FacebookIcon/></a></div></div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-emerald-50/50">© {new Date().getFullYear()} RentKhoj RKL. All rights reserved.</div>
    </div>
  </footer>;
}
