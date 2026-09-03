# CARRY demo script — 2:40 target

## 0:00–0:10 — Value first

**Visual:** CARRY profile, quickly revealing the three destination sites.

**Narration:** “Your preferences travel with your agent, not with every website. This is CARRY.”

## 0:10–0:20 — One prompt

**Visual:** Enter: “Use my normal preferences on Luma, Near, and Table.” Show the agent invoke `get_portable_preferences` once.

**Narration:** “This fictional preference intent belongs to the user. The agent reads it once, then discovers what each website actually supports.”

## 0:20–0:50 — Luma

**Visual:** Open Luma. Briefly show capability discovery, then reduced motion, autoplay off, compact reading, and large targets.

**Narration:** “Luma advertises four interface capabilities, so the agent sends only the relevant interface values through its WebMCP tools.”

## 0:50–1:25 — Near

**Visual:** Open Near. Apply all-in prices, marketing off, no retained history, and city-level location. Pause on `CITY_REQUIRED`.

**Agent:** “Which city should I use?”

**Human:** “Sagar.”

**Visual:** Invoke dynamic `set_city`; show the city-level state and updated event prices.

**Narration:** “Near knows its valid location modes. The agent understands my approximate-location intent. Neither should guess the missing city, so the human supplies it.”

## 1:25–1:50 — Table

**Visual:** Open Table. Apply vegetarian mode, highlighted peanut warnings, marketing off, and no retained history.

**Narration:** “Table exposes a different surface again. Vegetarian dishes remain; known peanuts are highlighted. When ingredient data is missing, it stays honestly unknown—never called safe.”

## 1:50–2:05 — Privacy recap

**Visual:** Fast recap of all three adapted interfaces and their preference summaries.

**Narration:** “No destination WebMCP tool receives the complete CARRY profile. The agent invokes only the preference relevant to that site's advertised capability.”

## 2:05–2:25 — WebMCP proof

**Visual:** Show the browser WebMCP panel for one route, one structured invocation, then navigate and show the tool list changing.

**Narration:** “These aren't scripted clicks. Each page registers semantic tools with strict schemas, runtime validation, and lifecycle cleanup. Human controls and agent calls share the same application actions.”

## 2:25–2:40 — Close

**Visual:** `User preference → agent → WebMCP capability → real website state`.

**Narration:** “Websites keep control of their product. Users keep control of their preferences. WebMCP connects them.”

**Final card:**

# CARRY

**Your preferences travel with your agent, not with every website.**

## Claim boundaries for narration and captions

CARRY explores portable personalization where a browser agent carries user intent and WebMCP-enabled websites expose the adaptations they support. WebMCP itself does not store or transport the profile. The three demo sites run as routes on one production origin; this is not proof of separate-origin interoperability or a claim to have invented portable personalization.

“Portable personalization without portable surveillance.” is the product direction and architecture being demonstrated, not an absolute privacy guarantee about what websites can know.
