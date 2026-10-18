import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Home as HomeIcon,
  Building2,
  BedDouble,
  RefreshCw,
  Users,
  ShieldCheck,
  ArrowRight,
  Trees,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const popularAreas = [
  "Sector 1",
  "Sector 2",
  "Sector 3",
  "Civil Township",
  "Chhend",
  "Uditnagar",
  "Rourkela Steel Plant",
];

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Any type");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const [search, setSearch] = useState({
    location: "",
    propertyType: "Any type",
    minRent: "",
    maxRent: "",
  });

  async function fetchProperties() {
    setLoading(true);
    setError("");

    try {
      // Keep the existing FastAPI integration and response handling.
      const response = await api.get("/properties");
      const data = response.data;
      const items = Array.isArray(data) ? data : data.properties || [];
      setProperties(items);
    } catch (err) {
      console.error("Unable to load properties:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load properties. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // oxlint-disable-next-line react(set-state-in-effect) -- fetch begins after mount
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const query = search.location.trim().toLowerCase();
    const searchableText = [
      property.title,
      property.location,
      property.city,
      property.area,
      property.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesLocation = !query || searchableText.includes(query);
    const type = String(
      property.property_type || property.type || ""
    ).toLowerCase();
    const selectedType = search.propertyType.toLowerCase();
    const matchesType =
      selectedType === "any type" ||
      type === selectedType ||
      type.includes(selectedType);

    const rentValue = property.monthly_rent ?? property.rent ?? property.price;
    const rent =
      rentValue === undefined || rentValue === null || rentValue === ""
        ? null
        : Number(rentValue);
    const matchesMin =
      search.minRent === "" ||
      (rent !== null && rent >= Number(search.minRent));
    const matchesMax =
      search.maxRent === "" ||
      (rent !== null && rent <= Number(search.maxRent));

    return matchesLocation && matchesType && matchesMin && matchesMax;
  });

  function handleSearch(event) {
    event.preventDefault();
    if (
      minRent !== "" &&
      maxRent !== "" &&
      Number(minRent) > Number(maxRent)
    ) {
      alert("Minimum rent cannot be higher than maximum rent.");
      return;
    }

    setSearch({ location, propertyType, minRent, maxRent });
    document
      .getElementById("available-properties")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function clearFilters() {
    setLocation("");
    setPropertyType("Any type");
    setMinRent("");
    setMaxRent("");
    setSearch({
      location: "",
      propertyType: "Any type",
      minRent: "",
      maxRent: "",
    });
  }

  function selectPopularArea(area) {
    setLocation(area);
    setSearch({ location: area, propertyType, minRent, maxRent });
    document
      .getElementById("available-properties")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function formatRent(property) {
    const rent = property.monthly_rent ?? property.rent ?? property.price;
    if (rent === undefined || rent === null || rent === "") {
      return "Contact owner";
    }
    return `₹${Number(rent).toLocaleString("en-IN")} / month`;
  }

  function getPropertyImage(property) {
    return property.image_urls?.[0] || property.images?.[0] || property.image_url || null;
  }

  return (
    <main className="bg-[#f6f8f3] text-slate-950">
      {/* Scenic Rourkela hero. The image source is credited below the hero. */}
      <section
        className="relative isolate min-h-[900px] overflow-hidden bg-[#163c31] bg-cover bg-center pb-8 pt-28 sm:pt-32 lg:min-h-[940px] lg:pt-36"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5, 25, 22, .67) 0%, rgba(5, 25, 22, .28) 58%, rgba(5, 25, 22, .08) 100%), linear-gradient(0deg, rgba(4, 27, 22, .62) 0%, rgba(4, 27, 22, 0) 55%), url('https://commons.wikimedia.org/wiki/Special:FilePath/HILLS_OF_ROURKELA.jpg')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl pt-3 sm:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-emerald-950/35 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
              <MapPin size={16} /> Made for Rourkela
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white drop-shadow sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your
              <br />
              Next Home
              <br />
              <span className="text-emerald-300">in Rourkela</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 drop-shadow sm:text-lg">
              Explore houses, flats, rooms and PGs across Rourkela. Simple
              search, clear details and local rentals — all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-emerald-950/45 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                <HomeIcon size={18} /> Houses &amp; Villas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-emerald-950/45 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                <Building2 size={18} /> Flats &amp; Apartments
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-emerald-950/45 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                <BedDouble size={18} /> Rooms &amp; PGs
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-emerald-950/45 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                <ShieldCheck size={18} /> Local Listings
              </span>
            </div>
          </div>

          {/* Search card: all fields are connected to the existing filter logic. */}
          <form
            onSubmit={handleSearch}
            className="mt-6 rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,.24)] backdrop-blur-xl sm:mt-7 sm:p-7 lg:mt-8"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                <Search size={25} strokeWidth={2.8} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Find a best place</h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  Search rental homes and rooms across Rourkela
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.35fr_.8fr_.8fr_auto] lg:items-end">
              <label className="block min-w-0">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Looking for</span>
                <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-slate-200 bg-[#f8faf6] px-3.5 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
                  <HomeIcon size={18} className="shrink-0 text-emerald-900" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none"
                  >
                    <option>Any type</option>
                    <option>Room</option>
                    <option>Flat</option>
                    <option>House</option>
                    <option>PG</option>
                  </select>
                </span>
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Location</span>
                <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-slate-200 bg-[#f8faf6] px-3.5 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
                  <MapPin size={18} className="shrink-0 text-emerald-900" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sector 3"
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Min. rent</span>
                <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-slate-200 bg-[#f8faf6] px-3.5 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
                  <span className="text-lg text-emerald-950">₹</span>
                  <input type="number" min="0" value={minRent} onChange={(e) => setMinRent(e.target.value)} placeholder="Min" className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                </span>
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Max. rent</span>
                <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-slate-200 bg-[#f8faf6] px-3.5 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
                  <span className="text-lg text-emerald-950">₹</span>
                  <input type="number" min="0" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} placeholder="Max" className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                </span>
              </label>

              <button
                type="submit"
                disabled={minRent !== "" && maxRent !== "" && Number(minRent) > Number(maxRent)}
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search size={19} /> Search
              </button>
            </div>

            {minRent !== "" && maxRent !== "" && Number(minRent) > Number(maxRent) && (
              <p className="mt-3 text-sm text-red-600">Minimum rent cannot exceed maximum rent.</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-bold text-slate-900">Popular:</span>
              {popularAreas.map((area) => (
                <button
                  type="button"
                  key={area}
                  onClick={() => selectPopularArea(area)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition sm:text-sm ${location === area ? "border-emerald-900 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-700 hover:bg-emerald-50"}`}
                >
                  {area}
                </button>
              ))}
              <button type="button" onClick={clearFilters} className="ml-auto px-2 py-2 text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-emerald-900">
                Reset
              </button>
            </div>
          </form>

          {/* Trust-building features without unsupported verification claims. */}
          <section id="why-rentkhoj" className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-[26px] border border-white/30 bg-white/20 shadow-xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 bg-slate-950/55 p-5 text-white sm:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-950 shadow-lg"><Users size={27} /></span>
              <div><h3 className="font-bold">For Tenants</h3><p className="mt-1 text-sm leading-5 text-white/80">Find a place that fits your needs.</p></div>
            </div>
            <div className="flex items-center gap-4 bg-emerald-950/65 p-5 text-white sm:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-950 shadow-lg"><HomeIcon size={27} /></span>
              <div><h3 className="font-bold">For Property Owners</h3><p className="mt-1 text-sm leading-5 text-white/80">List a rental and reach tenants.</p></div>
            </div>
            <div className="flex items-center gap-4 bg-slate-950/55 p-5 text-white sm:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-950 shadow-lg"><Search size={27} /></span>
              <div><h3 className="font-bold">Simple Search</h3><p className="mt-1 text-sm leading-5 text-white/80">Filter by area, type and rent.</p></div>
            </div>
            <div className="flex items-center gap-4 bg-emerald-950/65 p-5 text-white sm:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-950 shadow-lg"><Trees size={27} /></span>
              <div><h3 className="font-bold">Rourkela Focused</h3><p className="mt-1 text-sm leading-5 text-white/80">Built around our local community.</p></div>
            </div>
          </section>
        </div>
        <div className="mx-auto mt-4 max-w-7xl px-4 text-[10px] text-white/75 sm:px-6 lg:px-8">
          Background photo: Sidharthkochar, “HILLS OF ROURKELA”, CC BY-SA 3.0. <a className="underline underline-offset-2" href="https://commons.wikimedia.org/wiki/File:HILLS_OF_ROURKELA.jpg" target="_blank" rel="noreferrer">Source and licence</a>. Dark overlay and crop applied.
        </div>
      </section>

      {/* Live listings: preserves API data, filtering, refresh, error handling and detail links. */}
      <section id="available-properties" className="bg-[#f6f8f3] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-800">Explore rentals</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Available properties</h2>
              <p className="mt-2 text-slate-600">Discover your next home in Rourkela.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={clearFilters} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Clear filters</button>
              <button type="button" onClick={fetchProperties} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">Loading properties...</div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">
              <p className="font-semibold text-red-700">{error}</p>
              <button type="button" onClick={fetchProperties} className="mt-4 rounded-xl bg-emerald-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">Try again</button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <Building2 className="mx-auto text-emerald-900" size={40} />
              <h3 className="mt-4 text-xl font-bold text-slate-950">No properties found</h3>
              <p className="mt-2 text-sm text-slate-600">{properties.length === 0 ? "No listings are available yet. Be the first to list a property!" : "Try changing your location, property type or rent range."}</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-900 underline underline-offset-4">Clear all filters</button>
              {properties.length === 0 && <Link to="/post-property" className="ml-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-900">List a property <ArrowRight size={16} /></Link>}
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-slate-500">{filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => {
                  const image = getPropertyImage(property);
                  const propertyId = property.id || property._id;
                  return (
                    <article key={propertyId} className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-56 bg-slate-100">
                        {image ? <img src={image} alt={property.title || "Rental property"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" /> : <div className="flex h-full flex-col items-center justify-center text-slate-400"><Building2 size={42} /><span className="mt-2 text-sm">No image available</span></div>}
                        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-sm">Rental listing</span>
                      </div>
                      <div className="p-5">
                        <p className="text-lg font-extrabold text-emerald-900">{formatRent(property)}</p>
                        <h3 className="mt-2 truncate text-lg font-bold text-slate-950">{property.title || "Rental property"}</h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} className="shrink-0" /><span className="truncate">{[property.area, property.location, property.city, property.address].filter(Boolean).join(", ") || "Rourkela"}</span></p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
                          <span className="flex items-center gap-2"><BedDouble size={16} />{property.property_type || property.type || "Rental"}</span>
                          <span>{property.furnishing || "Details available"}</span>
                        </div>
                        <Link to={`/properties/${propertyId}`} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-800">View property <ArrowRight size={16} /></Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
