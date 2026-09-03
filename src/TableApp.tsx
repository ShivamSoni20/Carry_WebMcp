import { useEffect, useSyncExternalStore } from "react";
import { formatMenuPrice, TABLE_MENU } from "./table/menu";
import { tablePreferenceStore, type TablePreferenceStore } from "./table/store";
import { useTableWebMCP } from "./webmcp/useTableWebMCP";
import "./table.css";

export function TableApp({ store = tablePreferenceStore }: { store?: TablePreferenceStore }) {
  const preferences = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const webMCPStatus = useTableWebMCP(store);
  const visibleMenu = preferences.dietaryMode === "vegetarian" ? TABLE_MENU.filter((item) => item.vegetarian) : TABLE_MENU;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Table — Good food, clearly understood";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="table-app" data-warning={preferences.peanutWarning}>
      <header className="table-header">
        <a className="table-logo" href="/table" aria-label="Table home">TABLE</a>
        <nav aria-label="Table navigation"><a href="#menu">Menu</a><a href="#story">Our kitchen</a><a href="#visit">Visit</a></nav>
        <button className="table-book">Find a table</button>
      </header>

      <main>
        <section className="table-hero">
          <div className="table-hero-copy"><p className="table-kicker">A neighbourhood kitchen · Sagar</p><h1>Good food,<br /><em>clearly understood.</em></h1><p>A seasonal menu with straightforward ingredient information and plenty to share.</p><a href="#menu">See today’s menu ↓</a></div>
          <div className="table-still" aria-label="Abstract still life of a shared table"><span className="plate plate-one" /><span className="plate plate-two" /><span className="napkin" /><span className="leaf-form" /><p>Lunch 12–4<br />Dinner 6–11</p></div>
        </section>

        <section className="table-marquee" aria-label="Table values"><span>Season-led</span><i>✦</i><span>Ingredient-aware</span><i>✦</i><span>Made to share</span><i>✦</i><span>Always welcoming</span></section>

        <section className="table-menu" id="menu" aria-labelledby="menu-title">
          <div className="table-menu-heading"><div><p className="table-kicker">Today at Table</p><h2 id="menu-title">The menu</h2></div><p><strong>{visibleMenu.length} dishes shown</strong>{preferences.dietaryMode === "vegetarian" ? "Vegetarian menu" : "Full menu"}</p></div>
          <div className="table-menu-grid">
            {visibleMenu.map((item) => (
              <article className={`dish-card ${item.tone}`} key={item.id} data-dish={item.id}>
                <div className="dish-visual"><span>{item.category}</span><i /></div>
                <div className="dish-copy">
                  <div><h3>{item.name}</h3><b>{formatMenuPrice(item.price)}</b></div>
                  <p>{item.description}</p>
                  <div className="dish-labels">
                    <span className={item.vegetarian ? "veg" : "nonveg"}>{item.vegetarian ? "Vegetarian" : "Not vegetarian"}</span>
                    {!item.ingredientDataKnown ? <span className="unknown">? Ingredient information unavailable</span> : item.containsPeanuts ? <span className="peanut">⚠ Contains peanuts</span> : <span className="clear">No peanuts listed</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="table-status" aria-label="Current Table preferences">
          <div><span>◒</span><p><strong>Menu</strong>{preferences.dietaryMode === "vegetarian" ? "Vegetarian only" : "All dishes"}</p></div>
          <div><span>!</span><p><strong>Peanut information</strong>{preferences.peanutWarning === "highlight" ? "Warnings highlighted" : "Standard labels"}</p></div>
          <div><span>♡</span><p><strong>Marketing</strong>{preferences.marketing ? "Marketing: On" : "Marketing: Off"}</p></div>
          <div><span>↺</span><p><strong>Search history</strong>{preferences.historyRetention === "none" ? "Search history not retained" : "Recent searches saved"}</p></div>
        </section>

        <section className="table-history" aria-labelledby="table-history-title"><p className="table-kicker">Your activity</p><h2 id="table-history-title">Recent searches</h2>{preferences.recentSearches.length ? <div>{preferences.recentSearches.map((search) => <span key={search}>{search}</span>)}</div> : <p>Nothing saved. Future searches won’t be retained.</p>}</section>
      </main>

      <aside className="table-preferences" aria-labelledby="table-preferences-title">
        <div><p className="table-kicker">Your preferences</p><h2 id="table-preferences-title">Choose how you browse</h2><p>These controls affect this menu only. Ingredient labels describe our seeded menu data; they are not medical safety claims.</p></div>
        <label>Dietary mode<select aria-label="Dietary mode" value={preferences.dietaryMode} onChange={(e) => store.setDietaryMode(e.target.value)}><option value="all">All dishes</option><option value="vegetarian">Vegetarian</option></select></label>
        <label>Peanut warnings<select aria-label="Peanut warnings" value={preferences.peanutWarning} onChange={(e) => store.setPeanutWarning(e.target.value)}><option value="standard">Standard</option><option value="highlight">Highlight</option></select></label>
        <label>Marketing<select aria-label="Table marketing" value={preferences.marketing ? "enabled" : "disabled"} onChange={(e) => store.setMarketing(e.target.value === "enabled")}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></label>
        <label>Search history<select aria-label="Table search history" value={preferences.historyRetention} onChange={(e) => store.setHistoryRetention(e.target.value)}><option value="remember">Remember searches</option><option value="none">Do not retain searches</option></select></label>
        <p className={`table-webmcp ${webMCPStatus}`} aria-live="polite"><span />{webMCPStatus === "connected" ? "Preferences ready" : webMCPStatus === "unavailable" ? "Manual controls available" : webMCPStatus === "error" ? "Preference connection issue" : "Preparing preferences…"}</p>
      </aside>

      <footer className="table-footer" id="visit"><a className="table-logo" href="/table">TABLE</a><p>Good food, clearly understood.</p><div><a href="/">Luma</a><a href="/near">Near</a></div></footer>
    </div>
  );
}
