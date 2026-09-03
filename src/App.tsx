import { useSyncExternalStore } from "react";
import { lumaPreferenceStore } from "./luma/store";
import { useLumaWebMCP } from "./webmcp/useLumaWebMCP";

const stories = [
  { tag: "Field Notes", title: "The gardens teaching a city to breathe again", dek: "Small plots, patient hands, and a different idea of public space.", tone: "sage" },
  { tag: "Architecture", title: "A library built for lingering", dek: "Inside the quiet rooms changing how a neighborhood reads.", tone: "clay" },
  { tag: "Food", title: "The long lunch returns", dek: "Why a slower table is finding its way back into modern life.", tone: "sun" },
];

export function App() {
  const preferences = useSyncExternalStore(
    lumaPreferenceStore.subscribe,
    lumaPreferenceStore.getSnapshot,
    lumaPreferenceStore.getSnapshot,
  );
  const webMCPStatus = useLumaWebMCP(lumaPreferenceStore);

  return (
    <div
      className="app"
      data-motion={preferences.motionMode}
      data-density={preferences.readingDensity}
      data-targets={preferences.targetSize}
    >
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Luma home">Luma<span>.</span></a>
        <nav aria-label="Primary navigation">
          <a href="#stories">Stories</a><a href="#dispatches">Dispatches</a><a href="#about">About</a>
        </nav>
        <button className="plain-button">Subscribe</button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">The weekend edition · September 3</p>
            <h1 id="hero-title">A quieter way<br />to see the world.</h1>
            <p className="standfirst">Reporting on the people, places, and ideas making everyday life more considered.</p>
            <a className="read-link" href="#lead">Read the cover story <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-visual" aria-label="Sunlight across a quiet interior">
            <div className="sun-disc" /><div className="arch" /><div className="plant"><i /><i /><i /></div>
            <p>Issue No. 24<br /><span>Ways of living</span></p>
          </div>
        </section>

        <section className="story-strip" id="stories" aria-label="Featured stories">
          {stories.map((story, index) => (
            <article className="story-card" key={story.title}>
              <div className={`story-art ${story.tone}`}><span>0{index + 1}</span></div>
              <p className="story-tag">{story.tag}</p><h2>{story.title}</h2><p>{story.dek}</p>
            </article>
          ))}
        </section>

        <section className="lead-story" id="lead">
          <div className="lead-meta"><p className="eyebrow">Culture · 8 min read</p><p>Words by Mira Sen<br />Photographs by Anya Rao</p></div>
          <article>
            <h2>The radical pleasure of paying attention</h2>
            <p className="dropcap">What happens when we stop treating attention like a resource to optimize? Across studios, kitchens, and public gardens, a loose movement is choosing depth over speed.</p>
            <blockquote>“A full life isn’t the one with the most in it. It’s the one you were present for.”</blockquote>
            <p>The practice begins with ordinary things: one well-made cup, a street walked without a destination, a conversation allowed to find its own ending.</p>
          </article>
          <aside className="media-card" aria-label="Story film">
            <div className={`media-frame ${preferences.autoplay ? "is-playing" : "is-paused"}`}>
              <span className="play-mark">{preferences.autoplay ? "Ⅱ" : "▶"}</span>
              <div className="media-wave" />
            </div>
            <p><strong>Field film · 02:14</strong><span>{preferences.autoplay ? "Playing automatically" : "Autoplay is off"}</span></p>
          </aside>
        </section>
      </main>

      <aside className="preference-panel" aria-labelledby="preference-title">
        <div><p className="eyebrow">Reading preferences</p><h2 id="preference-title">Make Luma yours</h2><p>These controls change this page directly. A compatible browser agent can use the same actions.</p></div>
        <label>Motion<select aria-label="Motion" value={preferences.motionMode} onChange={(e) => lumaPreferenceStore.setMotionMode(e.target.value)}><option value="full">Full</option><option value="reduced">Reduced</option></select></label>
        <label>Autoplay<select aria-label="Autoplay" value={preferences.autoplay ? "on" : "off"} onChange={(e) => lumaPreferenceStore.setAutoplay(e.target.value === "on")}><option value="on">On</option><option value="off">Off</option></select></label>
        <label>Reading density<select aria-label="Reading density" value={preferences.readingDensity} onChange={(e) => lumaPreferenceStore.setReadingDensity(e.target.value)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>
        <label>Target size<select aria-label="Target size" value={preferences.targetSize} onChange={(e) => lumaPreferenceStore.setTargetSize(e.target.value)}><option value="standard">Standard</option><option value="large">Large</option></select></label>
        <p className={`webmcp-status ${webMCPStatus}`} aria-live="polite"><span />{webMCPStatus === "connected" ? "WebMCP connected" : webMCPStatus === "unavailable" ? "Manual controls available" : webMCPStatus === "error" ? "WebMCP registration issue" : "Checking WebMCP…"}</p>
      </aside>

      <footer id="about"><a className="wordmark" href="#top">Luma<span>.</span></a><p>Ideas for a considered life.</p><p>© 2026 Luma Journal</p></footer>
    </div>
  );
}
