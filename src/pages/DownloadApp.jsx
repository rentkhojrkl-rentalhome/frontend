
import {
  Download,
  Smartphone,
  ShieldCheck,
  MapPin,
  Home,
  Search,
  MessageCircle,
} from "lucide-react";

const APK_URL =
  "https://github.com/rentkhojrkl-rentalhome/mobileapp/releases/download/v1.0.0/RentKhojRKL.Android.v1.0.0.apk";

const features = [
  {
    icon: Search,
    title: "Discover rentals",
    description: "Browse rooms, PGs, flats and houses in Rourkela.",
  },
  {
    icon: Home,
    title: "List your property",
    description: "Reach people searching for their next home.",
  },
  {
    icon: MessageCircle,
    title: "Stay connected",
    description: "Manage your rental journey from your phone.",
  },
];

export default function DownloadApp() {
  return (
    <main className="min-h-screen bg-[#f8faf6] px-4 pb-16 pt-28 sm:pt-32">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#063b2d] px-6 py-14 text-center text-white shadow-xl sm:px-12 sm:py-20">
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl bg-lime-200 text-emerald-950">
          <MapPin size={43} fill="currentColor" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">
          Official RentKhojRKL Android App
        </p>

        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
          Find Your Next Home.
          <span className="block text-lime-300">
            Anywhere, Anytime.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-emerald-50/80 sm:text-lg">
          Explore rooms, PGs, flats and houses across Rourkela.
          Connect with property owners and manage your rental search
          from your Android phone.
        </p>

        <a
          href={APK_URL}
          className="mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-lime-300 px-8 py-4 font-extrabold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-lime-200"
        >
          <Download size={22} />
          Download for Android
        </a>

        <p className="mt-4 text-xs text-emerald-50/60">
          Version 1.0.0 · Android APK · Official release
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-900">
              <Icon size={23} />
            </span>

            <h2 className="mt-4 text-lg font-extrabold text-slate-950">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-800" size={24} />
          <h2 className="text-xl font-extrabold text-slate-950">
            How to install
          </h2>
        </div>

        <ol className="mt-5 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-3">
          <li>
            <strong className="text-slate-900">1. Download</strong>
            <br />
            Tap Download for Android on your phone.
          </li>
          <li>
            <strong className="text-slate-900">2. Allow installation</strong>
            <br />
            Android may ask you to allow installation from your browser.
          </li>
          <li>
            <strong className="text-slate-900">3. Install and open</strong>
            <br />
            Complete installation and open RentKhojRKL.
          </li>
        </ol>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Android may display a warning when installing an APK outside
          Google Play. Only install the official APK from a trusted source.
        </p>
      </section>
    </main>
  );
}
