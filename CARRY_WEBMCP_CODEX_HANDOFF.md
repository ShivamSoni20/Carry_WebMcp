# CARRY — WebMCP Challenge Codex Handoff

> **Project thesis:** Your preferences travel with your agent, not with every website.
>
> **Hackathon demo sentence:** “Use my normal preferences here.”
>
> **Core idea:** Today every website separately learns, stores, and interprets who a user is. CARRY explores a WebMCP-native future where a user's browser agent carries their preferences and maps them onto the semantic capabilities each website explicitly supports.

---

# 0. READ THIS FIRST — DO NOT START CODING BLINDLY

This project is for **The WebMCP Challenge** hosted by OpenAI on Devpost.

The project is NOT:
- a browser extension that blindly edits DOM/CSS,
- a chatbot,
- a generic personalization SaaS,
- a cookie-banner manager,
- a profile database,
- an accessibility-only settings panel,
- a recommendation engine,
- a remote MCP server by itself,
- a “WebMCP demo page” with debug buttons,
- a cross-site scraper,
- a system that secretly stores the user's whole preference profile on every site.

The product MUST make WebMCP the reason the experience works.

**Required architecture:**

```text
User preference profile
        ↓
Browser agent
        ↓
Website-specific WebMCP capabilities
        ↓
Shared application actions/state
        ↓
Real visible human UI
```

Every WebMCP action must call the SAME underlying application logic as the human-facing controls.

When an agent applies a preference, the actual webpage must visibly change.

---

# 1. HACKATHON TARGET

Official challenge framing:

> Build a WebMCP-powered web app that imagines and explores the future of the open web—where humans and agents can interact, collaborate, and create together.

Judging centers on:
1. **WebMCP Leverage**
2. **Execution**
3. **Potential Impact**
4. **Creativity & Ambition**

The strongest version of CARRY should make a judge think:

> “Of course my agent should carry my preferences between websites instead of every website separately building a profile about me.”

Submission requires:
- working live URL,
- public repository,
- visible open-source license,
- project description explaining why WebMCP fits,
- <3 minute public YouTube demo with audio,
- testing instructions,
- list of WebMCP clients/agents tested,
- explanation of AI tools used.

Official Devpost:
https://webmcp.devpost.com/

---

# 2. PRODUCT IDEA

## Name

**CARRY**

## One-line description

**Your preferences travel with your agent, not with every website.**

## Alternate judge line

> **Bring your own personalization to the web.**

## Judge pitch

> Today every website independently learns your preferences. CARRY uses WebMCP so your browser agent can bring your preferences with you and map them onto the semantic options each website actually supports.

## Core thesis

Today personalization looks like:

```text
Website A stores profile A
Website B stores profile B
Website C stores profile C
```

CARRY explores:

```text
User owns preferences
        ↓
agent carries them
        ↓
website exposes supported semantic adaptations
        ↓
agent maps user preference → website capability
        ↓
website visibly adapts
```

The user's portable preference profile should stay outside the demo websites.

Each site should only receive the minimum preference/action required for that session.

---

# 3. DEMO WEDGE

Do NOT try to personalize the entire internet.

Build exactly three believable, independent consumer websites:

1. **Luma** — news / reading site
2. **Near** — local events site
3. **Table** — restaurant / food discovery site

Each is a normal human website first.

Each supports different semantic adaptations.

The same user preference profile should produce different valid changes on each site.

---

# 4. SEEDED USER PREFERENCE PROFILE

For demo, the user's agent should conceptually know:

```text
- reduced motion
- no autoplay
- larger interaction targets
- compact but readable layout
- vegetarian
- peanut allergy awareness
- never opt into marketing
- use approximate location only
- always show all-in prices where supported
- do not retain search history if optional
```

Do NOT make every site support every preference.

The interesting part is negotiation/mapping.

Example:

```text
Luma supports:
- reduced motion
- autoplay preference
- reading density
- interaction target size

Near supports:
- approximate location
- total price display
- marketing preference
- history retention

Table supports:
- vegetarian filter
- allergy warnings
- marketing preference
- history retention
```

The agent must discover what each website supports.

---

# 5. THE 30-SECOND DEMO

User prompt:

> “Use my normal preferences on these sites.”

## Luma

Agent reaches the news site.

Initial tools:

```text
get_supported_preferences
get_current_preferences
```

The site reports:

```text
supports:
- motion_mode
- autoplay
- reading_density
- target_size
```

Agent maps user's stored preferences:

```text
reduced motion
no autoplay
larger targets
compact readable layout
```

Then applies supported changes.

The visible site transforms:
- autoplay stops,
- motion reduces,
- buttons enlarge,
- article width/density changes.

Important:
The human can still manually edit those settings.

## Near

Agent navigates to local events.

Current site supports:

```text
location_precision
price_display
marketing
history_retention
```

The agent applies:

```text
approximate location
all-in price
marketing off
history retention off / minimal
```

The visible events site changes:
- no precise-location prompt,
- prices show fees included,
- marketing toggle off,
- history state updated.

## Table

Agent reaches food discovery.

Supports:

```text
dietary_mode
allergen_warnings
marketing
history_retention
```

The agent applies:
- vegetarian,
- peanut allergy warning,
- no marketing,
- minimal history.

Food UI visibly removes incompatible dishes or marks them clearly.

## End state

Simple closing view or narration:

> **Three websites. One user. No three separate profiles.**

Final title:

> **Bring your preferences. Don't rebuild them.**

---

# 6. WHY WEBMCP IS THE HERO

Without WebMCP, a personal agent would need to:
- visually inspect settings pages,
- guess which toggles mean what,
- manipulate the DOM,
- maintain site-specific automation scripts,
- depend on proprietary preference APIs,
- or inject brittle CSS/JavaScript.

With WebMCP, each site explicitly declares:

```text
what personalization capabilities exist
what values they accept
what state is currently active
what can be changed right now
```

The user's agent can then map user intent onto valid website semantics.

This creates a new open-web model:

```text
Website owns:
- supported capabilities
- UI
- application rules
- current site state

User/agent owns:
- user preferences
- user intent
- what should be applied

WebMCP connects them.
```

This separation is the product.

---

# 7. CURRENT WEBMCP API — USE THIS

Primary current imperative API:

```js
const controller = new AbortController();

await document.modelContext.registerTool(
  {
    name: "set_motion_mode",
    description: "Set the website's supported motion preference.",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["full", "reduced"],
          description: "Motion behavior for this website."
        }
      },
      required: ["mode"],
      additionalProperties: false
    },
    async execute({ mode }) {
      return await setMotionMode(mode);
    }
  },
  { signal: controller.signal }
);
```

Current WebMCP concepts to respect:
- `document.modelContext.registerTool(...)`
- `AbortSignal` registration lifecycle
- JSON Schema inputs
- page/application-state-aware tools
- annotations such as `readOnlyHint`
- `untrustedContentHint` where appropriate
- origin isolation
- `tools` Permissions Policy
- current tool discovery can change after state/navigation changes

Do NOT center new code on old preview snippets such as:
- `navigator.modelContext` unless intentionally added as compatibility fallback,
- `unregisterTool()`,
- `provideContext()`,
- `clearContext()`,
- old testing-only APIs,
- server MCP in place of browser WebMCP.

---

# 8. CORE WEBMCP DESIGN FOR CARRY

The most important tool is NOT:

```text
apply_my_profile
```

That would hide the interesting interoperability.

Instead, websites should expose their OWN semantic capability surface.

Example Luma:

```text
get_supported_preferences
get_current_preferences
set_motion_mode
set_autoplay
set_reading_density
set_target_size
```

Near:

```text
get_supported_preferences
get_current_preferences
set_location_precision
set_price_display
set_marketing
set_history_retention
```

Table:

```text
get_supported_preferences
get_current_preferences
set_dietary_mode
set_allergen_warning
set_marketing
set_history_retention
```

The agent performs the translation.

That is critical.

CARRY is NOT a universal profile schema forced onto every website.

It is:

> user preference intent mapped onto website-owned capabilities.

---

# 9. CAPABILITY DISCOVERY IS PART OF THE PRODUCT

A site should explicitly expose what it can personalize.

Example tool:

```text
get_supported_preferences
```

Possible structured output:

```json
{
  "preferences": [
    {
      "key": "motion_mode",
      "values": ["full", "reduced"],
      "description": "Controls non-essential interface animation."
    },
    {
      "key": "autoplay",
      "values": ["on", "off"],
      "description": "Controls automatic media playback."
    }
  ]
}
```

Keep output concise.

The agent should not assume a site supports a preference just because another site does.

---

# 10. DYNAMIC TOOL AVAILABILITY

Use WebMCP state meaningfully.

Example Luma initial state:

```text
get_supported_preferences
get_current_preferences
```

After the user enters reading mode:

```text
set_reading_density
set_motion_mode
set_target_size
```

A media article may additionally expose:

```text
set_autoplay
```

A text-only article should not expose irrelevant media controls.

Likewise, on Table:
- allergen tools appear where food items exist,
- dietary controls appear on discovery/menu state,
- irrelevant tools should not exist globally.

A useful rule:

> Only expose capabilities relevant to the current site/page state.

---

# 11. SHARED HUMAN + AGENT STATE

Non-negotiable architecture:

```text
human toggle/button ───────┐
                           ├──> same action
WebMCP execute() ──────────┘
```

Example:

```ts
export async function setMotionMode(mode: MotionMode) {
  // validate
  // mutate site preference state
  // persist current session state
  // return structured result
}
```

Both:
- the human's settings UI,
- the WebMCP tool

must call that same action.

The UI must update immediately after an agent call.

---

# 12. PRIVACY MODEL — THIS IS CRITICAL

CARRY becomes weak if every website receives the entire user profile.

Do NOT send:

```json
{
  "allPreferences": {
    "diet": "...",
    "location": "...",
    "medical": "...",
    "shopping": "...",
    "everything": "..."
  }
}
```

Instead:

- website advertises capabilities,
- agent selects the relevant preference,
- agent sends only the minimum site-relevant value.

Example:

Luma receives:

```text
motion_mode = reduced
autoplay = off
```

It should NOT receive:
- vegetarian status,
- allergy info,
- location preference,
unless relevant.

This demonstrates a powerful principle:

> **portable personalization without portable surveillance.**

Do not claim CARRY solves privacy universally.
Demonstrate a privacy-minimizing architecture.

---

# 13. DO NOT USE SENSITIVE PERSONAL DATA

For hackathon demo:
- use a fictional profile,
- no real medical conditions,
- no real personal account data,
- no high-stakes decisions,
- no actual location permission,
- no actual ad network integration.

The peanut-allergy preference can be a seeded fictional demo setting, not user medical data.

If desired, simplify to:
- vegetarian
- “avoid peanuts” preference
without calling it medical diagnosis.

---

# 14. HUMAN-IN-THE-LOOP MOMENT

We need at least one preference that cannot be applied blindly.

Best example: Near local-events site.

Suppose user preference says:

```text
use approximate location only
```

Near can support:
- exact location,
- city-level location,
- manual city selection.

Agent discovers:

```text
approximate location supported only as city-level
```

It asks:

> “Near can use your city without precise location. Use Sagar as your city for this session?”

Human confirms.

This visibly proves:
- site provides actual capability/state,
- agent translates,
- human retains judgment.

Alternative:
Table has a dish that is vegetarian but marked “may contain peanuts.”
Agent should not silently hide or approve it if user policy is ambiguous.
It can surface the warning for the human.

---

# 15. PROGRESSIVE ENHANCEMENT

Without WebMCP:
- all three websites must remain fully usable by humans,
- each site should have normal settings/preferences UI.

With WebMCP:
- user's agent can discover and apply supported settings semantically,
- no brittle DOM interaction needed.

Feature detection:

```ts
const supported =
  typeof document !== "undefined" &&
  document.modelContext &&
  "registerTool" in document.modelContext;
```

Unsupported browser should not break the website.

---

# 16. WEBSITE 1 — LUMA

## Product

A polished reading/news site.

Human-visible controls:
- motion preference,
- autoplay,
- reading density,
- target size.

## Seeded content

One hero story with:
- video card,
- animated carousel,
- article layout.

## WebMCP tools

Initial:

```text
get_supported_preferences
get_current_preferences
```

Relevant mutation tools:

```text
set_motion_mode
set_autoplay
set_reading_density
set_target_size
```

## Visible wow

Before:
- carousel moves,
- video autoplay indicator,
- dense controls,
- narrow targets.

After agent applies profile:
- motion reduced,
- autoplay disabled,
- controls enlarged,
- reading layout visibly calmer.

Avoid cartoonishly extreme changes.
It should look like a better personalized product, not an accessibility gimmick.

---

# 17. WEBSITE 2 — NEAR

## Product

Local events discovery.

Human controls:
- location precision,
- price display,
- marketing opt-in,
- history retention.

## WebMCP tools

```text
get_supported_preferences
get_current_preferences
set_location_precision
set_price_display
set_marketing
set_history_retention
```

## Seeded event data

Events should have:
- base ticket price,
- fees,
- neighborhood/city data.

## Visible wow

Before:

```text
₹899 + fees
Enable precise location
Marketing enabled
Recent searches saved
```

After:

```text
₹1,049 total
City-level location
Marketing off
Search history not retained
```

The UI must visibly reflect those changes.

---

# 18. WEBSITE 3 — TABLE

## Product

Food / restaurant discovery.

Human controls:
- vegetarian mode,
- “avoid peanuts” warning preference,
- marketing,
- history.

## WebMCP tools

```text
get_supported_preferences
get_current_preferences
set_dietary_mode
set_avoidance_warning
set_marketing
set_history_retention
```

## Seeded menu

Include:
- vegetarian safe dish,
- non-vegetarian dish,
- vegetarian dish with peanut warning,
- item with unknown ingredients.

The site should use deterministic metadata.

No model is needed for food classification.

## Visible wow

After preferences:
- incompatible dishes de-emphasized/hidden according to site setting,
- peanut-warning item clearly flagged,
- marketing off,
- history preference updated.

Do not make claims of medical safety.

Use wording such as:

> “Contains peanuts”
or
> “Ingredient data unavailable”

not:
> “Safe for allergy.”

---

# 19. WHY NOT A UNIVERSAL `apply_profile` TOOL?

Because that would make CARRY a custom SDK disguised as WebMCP.

The interesting open-web behavior is:

```text
Agent knows user intent
        +
Website knows supported capabilities
        ↓
Agent maps between the two
```

Each website should be independently understandable.

That is how the product demonstrates interoperability.

---

# 20. SECURITY AND VALIDATION

JSON Schema is not a security boundary.

All input must be validated again.

Use:
- Zod or equivalent,
- strict enums,
- `additionalProperties: false`,
- server-side/action-layer validation,
- state validation,
- no secrets in client code.

Read-only tools:

```js
annotations: {
  readOnlyHint: true
}
```

Examples:
- `get_supported_preferences`
- `get_current_preferences`

Mutation tools should be narrow and deterministic.

If any site returns user-generated/external content in a tool result, consider:

```js
annotations: {
  untrustedContentHint: true
}
```

Do not rely on the model for policy enforcement.

---

# 21. TOOL NAMING

GOOD:

```text
get_supported_preferences
set_motion_mode
set_location_precision
set_price_display
set_dietary_mode
set_history_retention
```

BAD:

```text
click_settings
open_preferences
toggle_checkbox
change_ui
apply_profile_everywhere
```

Tool names should describe user intent or application capability, not DOM mechanics.

---

# 22. OUTPUT DESIGN

Tool output should be compact and next-step useful.

Example:

```json
{
  "updated": true,
  "preference": "motion_mode",
  "value": "reduced"
}
```

Capability discovery:

```json
{
  "supported": [
    {
      "key": "location_precision",
      "values": ["exact", "city", "manual"]
    },
    {
      "key": "price_display",
      "values": ["base", "all_in"]
    }
  ]
}
```

Avoid:
- giant settings dumps,
- raw internal IDs,
- full HTML,
- debug logs,
- raw exceptions.

---

# 23. ERROR SEMANTICS

Example unsupported mapping:

```json
{
  "ok": false,
  "code": "PREFERENCE_UNSUPPORTED",
  "preference": "reduced_motion",
  "message": "This page has no motion setting.",
  "retryable": false
}
```

Example state error:

```json
{
  "ok": false,
  "code": "NOT_AVAILABLE_ON_PAGE",
  "message": "Autoplay is not configurable on this text-only page.",
  "retryable": false
}
```

Example temporary failure:

```json
{
  "ok": false,
  "code": "TEMPORARY_STATE_FAILURE",
  "message": "Preference state could not be saved.",
  "retryable": true
}
```

---

# 24. ORIGIN / BROWSER REQUIREMENTS

Current Chrome WebMCP requires origin isolation.

Recommended headers:

```text
Origin-Agent-Cluster: ?1
Permissions-Policy: tools=(self)
```

Test using:
- ChatGPT in-app browser,
- Chrome 149+ / challenge-compatible Chrome with:
  `chrome://flags/#enable-webmcp-testing`

Do not add cross-origin iframe complexity unless necessary.

---

# 25. RECOMMENDED TECH STACK

Optimize for speed.

Recommended:

```text
Next.js
React
TypeScript
Zod
simple local/server session state
Vercel or Netlify
```

No need for:
- LangGraph,
- vector DB,
- custom LLM backend,
- login,
- OAuth,
- production database,
- remote MCP server,
- recommendation model,
- personalization ML.

The browser agent is already the AI.

The product challenge is:
- semantic capability exposure,
- shared state,
- visible adaptation,
- cross-site interoperability.

---

# 26. REPOSITORY STRUCTURE

Suggested:

```text
/
  simple CARRY explainer

/luma
  news site

/near
  events site

/table
  food site

/lib/
  webmcp/
    register-tool.ts
    feature-detect.ts
    schemas.ts

  preferences/
    demo-profile.ts
    mapping-types.ts

/sites/
  luma/
    actions.ts
    state.ts
    schemas.ts

  near/
    actions.ts
    state.ts
    schemas.ts

  table/
    actions.ts
    state.ts
    schemas.ts

/tests/
  domain/
  webmcp/
  lifecycle/

/evals/
  tool-selection/
  journeys/
```

Routes are fine for hackathon speed.

Separate subdomains are optional, not required.

Do not burn time on multi-origin deployment unless the core flow is already perfect.

---

# 27. MVP SCOPE — DO NOT EXPAND

Must ship:
- 3 believable sites,
- same demo preference profile,
- different WebMCP capability surface on each,
- visible UI adaptation,
- shared human + agent actions,
- one clarification moment,
- current WebMCP API,
- runtime validation,
- deterministic tests,
- tool-selection evals,
- public deployment,
- README,
- <3 min demo.

DO NOT BUILD:
- real browser extension,
- real user accounts,
- preference sync backend,
- real ad network settings,
- GPS access,
- real sensitive data,
- recommendation ML,
- universal preference ontology,
- privacy policy generator,
- custom agent,
- mobile app,
- marketplace,
- dashboard,
- analytics.

---

# 28. UI DIRECTION

CARRY should feel like:
- consumer web,
- calm,
- minimal,
- credible,
- direct.

Avoid:
- neon AI gradient,
- giant chatbot,
- “agent command center,”
- enterprise settings dashboard.

Each site should look independent:

## Luma
Editorial, calm, typography-first.

## Near
Modern local discovery, cards/map-like feel without needing a real map.

## Table
Food discovery, clean menu cards, strong ingredient metadata.

CARRY itself may only need a tiny intro screen:

```text
CARRY

Your preferences travel with your agent.

Demo profile:
Reduced motion
No autoplay
Vegetarian
Avoid peanuts
No marketing
Approximate location only
All-in prices
Minimal history
```

But the main demo should happen on the individual sites.

---

# 29. TESTING STRATEGY

Chrome WebMCP eval guidance emphasizes:
- correct tool selection,
- correct arguments,
- correct ordering,
- state-aware availability,
- end-to-end success.

## Deterministic tests

Examples:

### Luma
- reduced motion updates state
- autoplay off updates visible state
- invalid density rejected
- unsupported tool not registered on irrelevant page
- human and agent actions produce identical state

### Near
- city-level location applied
- precise location never required
- all-in price calculates deterministic fee display
- marketing off persists
- history retention state updates

### Table
- vegetarian mode filters/de-emphasizes non-veg items
- peanut-warning metadata surfaces correctly
- unknown ingredient data remains unknown
- no unsafe “allergy safe” claim generated

## WebMCP lifecycle tests

- tools register on mount/state
- AbortSignal cleanup
- no duplicate registrations
- relevant tool availability changes by state/page

---

# 30. TOOL-SELECTION EVALS

Example:

Prompt:

> “What preferences can this site support?”

Expected:

```text
get_supported_preferences
```

Prompt:

> “Don't autoplay videos.”

Expected:

```text
set_autoplay({ enabled: false })
```

Prompt:

> “Use approximate location only.”

On Near:

Expected:

```text
set_location_precision({ precision: "city" })
```

Prompt:

> “I don't want marketing.”

Expected:

```text
set_marketing({ enabled: false })
```

Prompt:

> “I'm vegetarian.”

On Table:

Expected:

```text
set_dietary_mode({ mode: "vegetarian" })
```

---

# 31. CROSS-SITE JOURNEY EVAL

User:

> “Use my normal preferences on these sites.”

Expected behavior:

## Luma
1. discover supported preferences
2. inspect current state
3. apply relevant supported preferences
4. ignore irrelevant user preferences

## Near
1. discover supported preferences
2. apply approximate location preference
3. apply total-price display
4. disable marketing
5. minimize history

## Table
1. discover supported preferences
2. apply vegetarian mode
3. apply peanut warning preference
4. disable marketing
5. minimize history

Important:
The agent should NOT attempt:
- vegetarian setting on Luma,
- motion setting on Table,
- exact location on a site when user says approximate only.

That is part of the demo's intelligence.

---

# 32. HUMAN CLARIFICATION EVAL

Near supports:

```text
city-level
manual city
exact
```

User preference:

```text
approximate only
```

If city isn't known, agent should ask:

> “Which city should I use?”

It should NOT guess.

This is one of the best human + agent collaboration moments.

---

# 33. DEVTOOLS PROOF

Use:

```text
Chrome DevTools
→ Application
→ WebMCP
```

Inspect:
- available tools,
- exact input,
- output,
- errors,
- current dynamic tool surface.

In video, use a 3–5 second DevTools shot only AFTER product value is clear.

Example:
Show Luma only exposes its own preference tools, then Near exposes a different set.

This visually proves cross-site semantic capability discovery.

---

# 34. SUPPORTER RESOURCE LESSONS

## Core WebMCP

Important:
- client-side semantic tools,
- human stays in the real website,
- tools reuse application logic,
- state-aware registration,
- current `document.modelContext`.

Source:
https://github.com/webmachinelearning/webmcp

## Chrome

Important:
- discovery,
- JSON Schema,
- state,
- tool security,
- evals,
- DevTools,
- origin requirements,
- progressive enhancement.

Sources:
https://developer.chrome.com/docs/ai/webmcp
https://developer.chrome.com/docs/ai/webmcp/secure-tools
https://developer.chrome.com/docs/ai/webmcp/evals
https://developer.chrome.com/docs/devtools/application/webmcp

## OpenAI Showcase

Already includes:
- collaborative notes,
- travel,
- meals,
- image/creative tools,
- commerce,
- games.

CARRY should not look like those categories.

Source:
https://developers.openai.com/showcase?view=webmcp-apps

## Cloudflare

Key lessons:
- WebMCP can progressively enhance sites,
- agents should rediscover tools after navigation/state changes,
- WebMCP should be preferred over brittle DOM actuation,
- browser WebMCP and remote MCP are complementary.

Sources:
https://blog.cloudflare.com/webmcp/
https://developers.cloudflare.com/browser-run/features/webmcp/

## Shopify

Key lesson:
- human UI and agent tools should use the same underlying state/actions,
- semantic actions beat DOM controls,
- ambiguity should lead to clarification.

Source:
https://shopify.dev/docs/api/web-mcp

## Vercel

Useful engineering lessons:
- strict schemas,
- server revalidation,
- bounded outputs,
- lifecycle testing,
- safe state-changing actions.

Source:
https://github.com/vercel/shop

## Netlify

Important:
- wrap the existing site's logic,
- don't build agent-only truth,
- validate at trusted boundaries,
- current WebMCP starter architecture.

Source:
https://www.netlify.com/webmcp-challenge/resources/

## GoogleChromeLabs

Use as implementation library, not idea source.

Source:
https://github.com/GoogleChromeLabs/webmcp-tools

## Modern Web Guidance

Follow:
- semantic tools,
- strict schemas,
- runtime validation,
- dynamic registration,
- AbortSignal cleanup,
- no secrets client-side,
- guard mutations.

Source:
https://github.com/GoogleChrome/modern-web-guidance-src/tree/main/guides/webmcp

---

# 35. STALE API WARNING

WebMCP is moving quickly.

If examples conflict:

Priority:
1. current `webmachinelearning/webmcp`,
2. current Chrome docs,
3. official Devpost requirements,
4. supporter examples.

Do not blindly copy:
- old Chrome version numbers,
- `navigator.modelContext`,
- testing-only preview APIs,
- `unregisterTool`,
- `provideContext`,
- `clearContext`.

Current challenge implementation should center on:

```js
document.modelContext.registerTool(...)
```

with AbortSignal lifecycle.

---

# 36. README STORY

Lead with:

> **Every website currently learns you separately.**

Then:

> CARRY explores a WebMCP-native alternative: your browser agent carries your preferences and maps them onto the semantic capabilities each website explicitly supports.

Then:

```text
TODAY

User
├── profile at News site
├── profile at Events site
└── profile at Food site


CARRY

User preferences
       ↓
personal agent
       ↓
WebMCP capability discovery
       ↓
website-specific adaptation
```

Explain:
- user-owned preference intent,
- website-owned capabilities,
- minimal disclosure,
- shared human/agent state,
- no brittle DOM manipulation.

Include:
- architecture,
- site/tool table,
- demo profile,
- screenshots,
- tests/evals,
- browser setup,
- security/privacy design,
- LICENSE,
- exact demo prompt.

---

# 37. DEMO VIDEO PLAN (<3 MIN)

## 0:00–0:10

Show three sites.

Narration:

> “Every website makes you teach it who you are again. CARRY explores a WebMCP-native alternative: bring your preferences with your agent.”

## 0:10–0:25

Show demo profile briefly.

Prompt:

> “Use my normal preferences on these sites.”

## 0:25–0:55

Luma:
- discover capabilities,
- reduced motion,
- no autoplay,
- larger targets,
- visible change.

## 0:55–1:25

Near:
- all-in price,
- city-level location,
- no marketing,
- minimal history,
- human clarification if city is needed.

## 1:25–1:55

Table:
- vegetarian,
- peanut warning,
- no marketing,
- minimal history.

## 1:55–2:15

Side-by-side before/after or quick revisit.

Narration:

> “The websites never received one giant universal profile. Each advertised only what it supports, and the agent shared only the preference required for that capability.”

## 2:15–2:35

DevTools WebMCP:
- Luma tool surface,
- Near different tool surface,
- structured tool call.

## 2:35–2:55

Architecture and close:

> “Websites keep control of their product. Users keep control of their preferences. WebMCP connects them.”

Final line:

> **Bring your preferences. Don't rebuild them.**

---

# 38. SUBMISSION CHECKLIST

- [ ] live URL works incognito
- [ ] works in WebMCP-capable browser
- [ ] real `document.modelContext.registerTool`
- [ ] all tool actions update real UI
- [ ] same actions used by humans and agents
- [ ] public repository
- [ ] LICENSE visible
- [ ] README explains WebMCP fit
- [ ] deterministic tests
- [ ] tool-selection evals
- [ ] one full cross-site journey
- [ ] public YouTube <3 min
- [ ] audio present
- [ ] tested agents/clients documented
- [ ] AI coding tools documented
- [ ] no changes after submission freeze

---

# 39. FIRST CODEX TASK

Do NOT build all three sites in one pass.

First:

1. Inspect the empty repository.
2. Initialize a minimal TypeScript/React app.
3. Add a reusable WebMCP registration helper using the current API.
4. Build **Luma only**.
5. Create a convincing human news/reading UI.
6. Implement normal human preference controls.
7. Implement:
   - `get_supported_preferences`
   - `get_current_preferences`
   - `set_motion_mode`
   - `set_autoplay`
   - `set_reading_density`
   - `set_target_size`
8. Ensure human controls and WebMCP tools use the same action layer.
9. Add runtime validation.
10. Add deterministic tests.
11. Verify tools register and clean up correctly.
12. Verify manual tool invocation changes the visible UI.
13. Stop.

Only after Luma is verified should Near be built.
Only after Near works should Table be built.

---

# 40. FIRST PROMPT TO GIVE CODEX

```text
Read CARRY_WEBMCP_CODEX_HANDOFF.md completely before changing anything.

Treat its current WebMCP API guidance, architecture, product thesis,
privacy constraints, MVP scope, and stale-API warnings as requirements.

This project is NOT a chatbot, browser extension, universal settings dashboard,
remote MCP server, or DOM manipulation demo.

Start by building ONLY the Luma vertical slice.

Requirements for the first pass:
1. Human-first Luma reading/news UI.
2. Normal manual preference controls.
3. Current WebMCP implementation using document.modelContext.registerTool.
4. get_supported_preferences.
5. get_current_preferences.
6. set_motion_mode.
7. set_autoplay.
8. set_reading_density.
9. set_target_size.
10. All WebMCP calls and human controls must use the same underlying actions/state.
11. Runtime validation.
12. AbortSignal lifecycle cleanup.
13. Tests.
14. Unsupported-WebMCP progressive fallback.

Do not build Near or Table yet.
Do not add an LLM backend.
Do not add auth.
Do not add a database unless absolutely necessary.
Do not use stale WebMCP APIs.

Stop after Luma works both:
A. manually for a human, and
B. through a real WebMCP invocation that changes the same visible state.

Then run tests and report:
- what is working,
- registered tools,
- lifecycle behavior,
- test results,
- remaining risks.
```

---

# 41. SOURCES CODEX SHOULD READ

Read before making WebMCP architecture decisions.

### Core
https://github.com/webmachinelearning/webmcp
https://github.com/webmachinelearning/webmcp/blob/main/README.md
https://github.com/webmachinelearning/webmcp/blob/main/index.bs
https://github.com/webmachinelearning/webmcp/blob/main/declarative-api-explainer.md

### Chrome
https://developer.chrome.com/docs/ai/webmcp
https://developer.chrome.com/docs/ai/webmcp/secure-tools
https://developer.chrome.com/docs/ai/webmcp/evals
https://developer.chrome.com/docs/devtools/application/webmcp
https://developer.chrome.com/blog/ai-webmcp-origin-trial

### Google ecosystem
https://www.npmjs.com/package/use-webmcp-tool
https://github.com/GoogleChromeLabs/webmcp-tools
https://github.com/GoogleChrome/modern-web-guidance-src/tree/main/guides/webmcp

### OpenAI
https://developers.openai.com/showcase?view=webmcp-apps

### Cloudflare
https://blog.cloudflare.com/webmcp/
https://developers.cloudflare.com/browser-run/features/webmcp/
https://github.com/cloudflare/agents

### Shopify
https://shopify.dev/docs/api/web-mcp
https://shopify.dev/docs/agents

### Vercel
https://github.com/vercel/shop
https://github.com/vercel/shop/pull/498
https://github.com/vercel/shop/pull/504

### Netlify
https://www.netlify.com/webmcp-challenge/resources/

### Hackathon
https://webmcp.devpost.com/
https://webmcp.devpost.com/resources
https://webmcp.devpost.com/rules

---

# 42. SUCCESS CRITERION

At every major decision, ask:

> If WebMCP disappeared, would this collapse back into brittle site-specific DOM automation or proprietary integrations?

If not, WebMCP is not central enough.

Then ask:

> Does each website remain a good human product without an agent?

If not, this violates the human + agent product model.

Then ask:

> Is the user's full profile unnecessarily copied into the website?

If yes, redesign it.

The desired final judge reaction is:

> “The web currently personalizes people by tracking them. CARRY shows an alternative where the user brings their own preferences and websites simply expose the adaptations they support.”

Build that one idea extremely well.
