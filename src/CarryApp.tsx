import { useEffect } from "react";
import { PORTABLE_PREFERENCES } from "./carry/portablePreferences";
import { useCarryWebMCP } from "./webmcp/useCarryWebMCP";
import "./carry.css";

const groups = [
  {
    number: "01",
    title: "Interface",
    items: ["Reduce non-essential motion", "Never autoplay media", "Prefer larger interaction targets", "Compact readable layouts"],
  },
  {
    number: "02",
    title: "Privacy",
    items: ["Approximate location only", "No marketing", "Don't retain search history when optional"],
  },
  {
    number: "03",
    title: "Discovery",
    items: ["Show all-in prices", "Vegetarian", "Warn when peanuts are known to be present"],
  },
];

const sites = [
  { name: "Luma", kind: "Reading", href: "/", mark: "L" },
  { name: "Near", kind: "Local events", href: "/near", mark: "N" },
  { name: "Table", kind: "Food discovery", href: "/table", mark: "T" },
];

export function CarryApp() {
  const webMCPStatus = useCarryWebMCP();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "CARRY — Your preferences travel with your agent, not with every website.";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="carry-app">
      <header className="carry-header">
        <a href="/carry" className="carry-wordmark" aria-label="CARRY home">CARRY<span>↗</span></a>
        <p>Portable preference intent</p>
        <span className={`carry-connection ${webMCPStatus}`}>{webMCPStatus === "connected" ? "Agent-readable" : webMCPStatus === "unavailable" ? "Human-readable" : webMCPStatus === "error" ? "Connection issue" : "Preparing"}</span>
      </header>

      <main>
        <section className="carry-hero" aria-labelledby="carry-title">
          <p className="carry-eyebrow">A WebMCP exploration</p>
          <h1 id="carry-title">Your preferences travel<br />with your <em>agent,</em><br />not with every website.</h1>
          <p className="carry-intro">One user-owned set of intentions. Each website exposes what it supports. Your agent shares only what is relevant.</p>
          <div className="carry-flow" aria-label="CARRY architecture"><span>You</span><i>→</i><span>Agent</span><i>→</i><span>Site capability</span><i>→</i><span>Visible change</span></div>
        </section>

        <section className="carry-profile" aria-labelledby="profile-title">
          <div className="carry-section-title"><p className="carry-eyebrow">My preferences</p><h2 id="profile-title">What I carry</h2><p>This fictional demo profile stays here. Destination sites receive only narrow calls matching their own capabilities.</p></div>
          <div className="carry-groups">
            {groups.map((group) => <article key={group.title} className="carry-group"><span>{group.number}</span><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
          <details className="carry-structured"><summary>Structured intent preview</summary><pre>{JSON.stringify(PORTABLE_PREFERENCES, null, 2)}</pre></details>
        </section>

        <section className="carry-sites" aria-labelledby="sites-title">
          <div><p className="carry-eyebrow">Try these sites</p><h2 id="sites-title">Three places.<br />Three different capabilities.</h2></div>
          <div className="carry-site-list">{sites.map((site) => <a key={site.name} href={site.href}><span className="site-mark">{site.mark}</span><span><strong>{site.name}</strong><small>{site.kind}</small></span><b>Visit ↗</b></a>)}</div>
        </section>
      </main>

      <footer className="carry-footer"><strong>CARRY</strong><p>Portable personalization without portable surveillance.</p><span>WebMCP Challenge · 2026</span></footer>
    </div>
  );
}
