import { Link } from "react-router-dom";
import { MapPin, Home, Users, Search, ArrowRight, HeartHandshake, Building2 } from "lucide-react";

const principles = [
  { icon: <MapPin size={23}/>, title: "Made for Rourkela", text: "A local-first rental experience designed around the areas and needs of our city." },
  { icon: <Search size={23}/>, title: "Easy discovery", text: "Explore rooms, PGs, flats and houses with location, property-type and rent filters." },
  { icon: <HeartHandshake size={23}/>, title: "Clear communication", text: "Useful property details help renters and owners start a more informed conversation." },
];

export default function About() {
  return <main className="rk-page min-h-screen">
    <section className="relative overflow-hidden bg-gradient-to-br from-[#063f2d] via-[#08764d] to-[#b6e879] px-4 pb-16 pt-12 text-white sm:px-6 sm:pb-20 sm:pt-16">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"/>
      <div className="relative mx-auto max-w-6xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold"><MapPin size={16}/> RentKhoj RKL · Rourkela, Odisha</span>
        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">Helping Rourkela find its <span className="text-lime-200">next home.</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">RentKhoj is a local rental marketplace concept built to make discovering rooms, PGs, flats and houses in Rourkela simpler for tenants and property owners.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-lime-50">Explore properties <ArrowRight size={17}/></Link><Link to="/post-property" className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"><Home size={17}/> List a property</Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-emerald-800">Our purpose</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Local rentals, made simpler.</h2><p className="mt-5 leading-7 text-slate-600">From students searching for a room to families looking for a house and owners sharing a rental, RentKhoj brings core discovery tools into one place. Listings and availability should always be confirmed directly with the owner before making a payment.</p></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-950/10"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-900"><Users size={25}/></span><h3 className="mt-4 text-lg font-extrabold text-slate-950">For tenants</h3><p className="mt-2 text-sm leading-6 text-slate-600">Search by locality, rental type and budget to narrow down options.</p></div><div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-950/10"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-900"><Building2 size={25}/></span><h3 className="mt-4 text-lg font-extrabold text-slate-950">For owners</h3><p className="mt-2 text-sm leading-6 text-slate-600">Share property details and manage listings through your account.</p></div></div>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">{principles.map((item)=><article key={item.title} className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-white">{item.icon}</span><h3 className="mt-4 text-lg font-extrabold text-slate-950">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></article>)}</div>
      <div className="mt-10 rounded-3xl bg-[#eaf4e7] p-6 sm:p-8"><h2 className="text-2xl font-black text-emerald-950">Start with your next step</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-950/75">Browse current listings or share a rental property with the RentKhoj community.</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/search" className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Find a home</Link><Link to="/contact" className="rounded-full border border-emerald-950/20 bg-white px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-emerald-50">Contact us</Link></div></div>
    </section>
  </main>;
}
