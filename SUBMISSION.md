# CARRY — Hackathon submission

## Project name

CARRY

## One-line

Your preferences travel with your agent, not with every website.

## Short description

CARRY explores portable personalization where a browser agent carries user intent and WebMCP-enabled websites expose the adaptations they support.

## The problem

People repeatedly configure motion, autoplay, privacy, pricing, dietary, marketing, and history choices. Websites independently infer and store those choices, creating duplicated work and duplicated behavioral profiles. A general browser agent could help, but DOM guessing and site-specific automation are brittle and give websites no explicit control over supported behavior.

## The solution

CARRY begins with a fictional user-owned intent profile. The browser agent reads it once, visits three unrelated consumer sites, discovers each site's WebMCP capabilities, and makes narrow calls using only relevant values. Each call reaches the same validated action layer as the site's human controls, so the real interface changes immediately.

- Luma adapts motion, autoplay, reading density, and target size.
- Near adapts location precision, all-in pricing, marketing, and search history.
- Table adapts dietary display, peanut warnings, marketing, and search history.

## Why this matters

CARRY treats personalization as something the user can bring to the web, rather than something every website must independently infer and store. **Portable personalization without portable surveillance.** This describes the product direction and architecture being demonstrated, not an absolute privacy guarantee.

## Why WebMCP?

DOM/browser actuation forces agents to infer meaning from visual controls and breaks when markup changes. A custom API would require proprietary integration, while an `apply_profile` endpoint would leak too much and hide the interoperability challenge.

WebMCP lets every site advertise semantic, structured, state-aware capabilities. The browser agent can discover those capabilities, map user intent to accepted values, and invoke real site-owned actions. Shared state matters because an agent action is never a shadow setting: humans see it and can override it, and WebMCP immediately observes that override.

This requires more than an LLM. The sites provide enforceable schemas, runtime validation, lifecycle-aware registration, truthful application state, and visible deterministic behavior.

## Human + agent collaboration

The user's intent says “approximate location only.” Near supports precise, city-level, and manual modes. The agent maps approximate intent to city-level location. If no city is known, Near returns `CITY_REQUIRED` and dynamically exposes `set_city`. The agent asks the human; after they answer “Sagar,” it continues. The site supplies constraints, the agent translates intent, and the human retains judgment.

## Implementation

- React, TypeScript, Vite, and Zod
- Current `document.modelContext.registerTool(toolDefinition, { signal })` API
- Site-specific stores shared by human controls and WebMCP executions
- Strict JSON Schema plus independent Zod revalidation
- Read-only discovery annotations
- AbortController cleanup and route isolation
- State-aware Near `set_city` registration
- Deterministic seeded content and compact tool results
- Native browser verification and machine-readable evals

## Privacy

No destination WebMCP tool receives the complete CARRY profile. The agent invokes only the preference relevant to that site's advertised capability.

This is a claim about tool inputs, not a guarantee that destination websites can never know other user information. The browser agent carries intent; WebMCP itself does not store or transport user preferences. There is no account, cloud profile, database, remote MCP server, GPS request, or real health data.

## What is novel

CARRY demonstrates a specific WebMCP-based approach to portable personalization; it does not claim to have invented the concept or to be an established browser standard. Luma, Near, and Table are distinct experiences served as routes on one Vercel origin. The verified journey demonstrates route-specific capability mapping and isolation, not interoperability across separate production origins.

## Testing instructions

1. Run `npm install`, `npm test`, and `npm run dev`.
2. Open `/carry` in a challenge-compatible WebMCP browser and invoke `get_portable_preferences`.
3. Navigate to each site and inspect its distinct tool surface.
4. Apply relevant narrow values and confirm the visible controls and content update.
5. On Near, select city precision, observe `CITY_REQUIRED`, then invoke dynamic `set_city` with `Sagar`.
6. Navigate across all routes and confirm no stale tools remain.
7. Manually override a control and confirm `get_current_preferences` returns it.

## Screenshot shot list

1. CARRY profile hero with all three site links.
2. Luma before/after interface preferences.
3. Near showing all-in pricing and the city clarification state.
4. Table vegetarian menu with known peanut warning and unknown ingredient label.
5. Browser WebMCP panel showing route-specific tools.

## Demo video outline

Use `DEMO_SCRIPT.md` for the timed 2:40 script: product value first, then CARRY profile, Luma, Near clarification, Table uncertainty, privacy recap, brief WebMCP proof, and architecture close.

## Submission links and remaining materials

- Repository URL: [ShivamSoni20/Carry_WebMcp](https://github.com/ShivamSoni20/Carry_WebMcp)
- Production URL: [CARRY on Vercel](https://webmcp-mu.vercel.app/carry)
- Public YouTube demo URL: **Pending — no uploaded video URL has been confirmed.**
- Screenshots/thumbnail: Final assets to be confirmed.
- Official Devpost form fields: Verify and complete on the submission form.
