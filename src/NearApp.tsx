import { useEffect, useSyncExternalStore } from "react";
import { NEAR_EVENTS, eventTotal, formatRupees } from "./near/events";
import { SEEDED_CITIES } from "./near/preferences";
import { nearPreferenceStore } from "./near/store";
import { useNearWebMCP } from "./webmcp/useNearWebMCP";
import "./near.css";

export function NearApp({ store = nearPreferenceStore }: { store?: typeof nearPreferenceStore }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Near — Local events worth going out for";
    return () => { document.title = previousTitle; };
  }, []);

  const preferences = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const needsCity = preferences.locationPrecision !== "precise" && preferences.city === null;
  const webMCPStatus = useNearWebMCP(store, needsCity);

  const locationText = preferences.locationPrecision === "precise"
    ? "Precise area · simulated"
    : preferences.city
      ? `${preferences.city} only · ${preferences.locationPrecision === "city" ? "city-level" : "manual"}`
      : "City needed";

  return (
    <div className="near-app">
      <header className="near-header">
        <a className="near-logo" href="/near" aria-label="Near home"><span>near</span><i /></a>
        <nav aria-label="Near navigation"><a href="#events">Explore</a><a href="#weekend">This weekend</a><a href="#saved">Saved</a></nav>
        <button className="near-avatar" aria-label="Open profile">NS</button>
      </header>

      <main>
        <section className="near-hero">
          <div>
            <p className="near-kicker">Your city is happening</p>
            <h1>Find something<br />worth going out for.</h1>
            <p>Handpicked events, workshops, markets, and nights out around you.</p>
          </div>
          <div className="near-map" aria-label="Illustrated map of local events">
            <span className="road road-one" /><span className="road road-two" /><span className="road road-three" />
            <i className="pin pin-one">♫</i><i className="pin pin-two">✦</i><i className="pin pin-three">☕</i>
            <div className="location-pill"><span />{locationText}</div>
          </div>
        </section>

        <section className="near-toolbar" aria-label="Event filters">
          <div><button className="filter active">All events</button><button className="filter">Music</button><button className="filter">Food</button><button className="filter">Workshops</button></div>
          <p>{NEAR_EVENTS.length} things to do near you</p>
        </section>

        <section className="near-events" id="events" aria-labelledby="events-title">
          <div className="section-heading"><div><p className="near-kicker">Coming up</p><h2 id="events-title">Make a plan</h2></div><button>View calendar ↗</button></div>
          <div className="event-grid">
            {NEAR_EVENTS.map((event, index) => (
              <article className="event-card" key={event.name}>
                <div className={`event-art ${event.color}`}><span>{event.category}</span><b>{String(index + 1).padStart(2, "0")}</b></div>
                <div className="event-body">
                  <p className="event-date">{event.date} · {event.time}</p>
                  <h3>{event.name}</h3>
                  <p className="venue">{event.venue} · {event.neighborhood}</p>
                  <p className="price" data-event={event.name}>{event.basePrice === 0 ? "Free" : preferences.priceDisplay === "all_in" ? `${formatRupees(eventTotal(event))} total` : `${formatRupees(event.basePrice)} + fees`}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="near-signals" aria-label="Current preferences">
          <div><span>⌖</span><p><strong>Location</strong>{locationText}</p></div>
          <div><span>₹</span><p><strong>Pricing</strong>{preferences.priceDisplay === "all_in" ? "All-in totals shown" : "Base prices shown"}</p></div>
          <div><span>♡</span><p><strong>Recommendations</strong>{preferences.marketing ? "Marketing enabled" : "Marketing disabled"}</p></div>
          <div><span>↺</span><p><strong>Search history</strong>{preferences.historyRetention === "none" ? "Search history not retained" : "Recent searches saved"}</p></div>
        </section>

        <section className="recent" id="saved" aria-labelledby="recent-title">
          <p className="near-kicker">Your activity</p><h2 id="recent-title">Recent searches</h2>
          {preferences.recentSearches.length ? <div className="search-chips">{preferences.recentSearches.map((search) => <span key={search}>{search}</span>)}</div> : <p className="history-empty">Nothing saved. New searches won’t be retained.</p>}
        </section>
      </main>

      <aside className="near-preferences" aria-labelledby="near-preferences-title">
        <div className="preferences-intro"><p className="near-kicker">Preferences</p><h2 id="near-preferences-title">How Near works for you</h2><p>Choose what this events site uses. These settings remain fully available without agent support.</p></div>
        <label>Location precision<select aria-label="Location precision" value={preferences.locationPrecision} onChange={(e) => store.setLocationPrecision(e.target.value)}><option value="precise">Precise</option><option value="city">City-level</option><option value="manual">Manual city</option></select></label>
        {preferences.locationPrecision !== "precise" && <label>City<select aria-label="City" value={preferences.city ?? ""} onChange={(e) => store.setCity(e.target.value)}><option value="" disabled>Choose a city</option>{SEEDED_CITIES.map((city) => <option key={city}>{city}</option>)}</select></label>}
        <label>Ticket prices<select aria-label="Ticket prices" value={preferences.priceDisplay} onChange={(e) => store.setPriceDisplay(e.target.value)}><option value="base">Base price</option><option value="all_in">All-in price</option></select></label>
        <label>Marketing<select aria-label="Marketing" value={preferences.marketing ? "enabled" : "disabled"} onChange={(e) => store.setMarketing(e.target.value === "enabled")}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></label>
        <label>Search history<select aria-label="Search history" value={preferences.historyRetention} onChange={(e) => store.setHistoryRetention(e.target.value)}><option value="remember">Remember searches</option><option value="none">Do not retain searches</option></select></label>
        {needsCity && <p className="city-required" role="status">Choose a city to finish using approximate location.</p>}
        <p className={`near-webmcp ${webMCPStatus}`} aria-live="polite"><span />{webMCPStatus === "connected" ? "Preferences ready" : webMCPStatus === "unavailable" ? "Manual controls available" : webMCPStatus === "error" ? "Preference connection issue" : "Preparing preferences…"}</p>
      </aside>

      <footer className="near-footer"><a className="near-logo" href="/near"><span>near</span><i /></a><p>Go somewhere good.</p><a href="/">Visit Luma</a></footer>
    </div>
  );
}
