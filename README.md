# CARRY

> **Your preferences travel with your agent, not with every website.**

Every website currently learns you separately: interface behavior, privacy choices, pricing preferences, dietary needs, marketing consent, and browsing history. That duplicates settings—and behavioral profiles—across the web.

CARRY explores a WebMCP-native alternative:

```text
User owns preference intent
        ↓
browser agent carries it
        ↓
website advertises supported capabilities
        ↓
agent sends only relevant values
        ↓
the real website visibly adapts
```

## Why WebMCP

Without WebMCP, an agent must guess at DOM controls, maintain site-specific scripts, or depend on proprietary integrations. WebMCP gives it semantic discovery, strict structured inputs, live page state, and site-owned actions that update the same interface a human uses.

This is not just an LLM demo. The value comes from each website explicitly owning its capability surface through `document.modelContext.registerTool`, while the browser agent owns the mapping from user intent to those capabilities.

## Demo

Open `/carry`, then `/`, `/near`, and `/table`. Ask the browser agent:

> “Use my normal preferences on Luma, Near, and Table.”

| Site | Domain | WebMCP capabilities |
| --- | --- | --- |
| CARRY | User profile | portable preference intent |
| Luma | Reading | motion, autoplay, density, target size |
| Near | Events | location, pricing, marketing, history; city only when required |
| Table | Food | dietary mode, peanut-warning display, marketing, history |

Near provides the human-and-agent clarification moment. The agent maps “approximate location only” to Near's city-level mode. If the city is unknown, Near returns `CITY_REQUIRED` and exposes `set_city`; the human supplies “Sagar” instead of the agent guessing.

## Privacy architecture

> **Portable personalization without portable surveillance.**

CARRY does not push a universal user profile into websites:

```text
website advertises capability
        ↓
agent selects one relevant preference
        ↓
narrow tool call
```

Luma never receives food, location, or pricing preferences. Near never receives food or reading preferences. Table never receives location, pricing, or reading preferences. There is no `apply_profile`, remote profile server, account, database, or cross-site synchronization layer.

## Implementation and security

- Current imperative API: `document.modelContext.registerTool(tool, { signal })`
- Normal controls and WebMCP tools share the same validated in-memory stores/actions
- Strict JSON Schema with `additionalProperties: false`
- Independent Zod runtime validation at the action/tool boundary
- `readOnlyHint` annotations on discovery tools
- AbortController cleanup on component unmount and route navigation
- State-aware dynamic `set_city` registration on Near
- Deterministic fictional content with no secrets or real sensitive data
- Full human workflow when WebMCP is unavailable

## Evals

Machine-readable cases live in [`evals/webmcp-cases.json`](evals/webmcp-cases.json), with the complete journey in [`evals/end-to-end-journey.json`](evals/end-to-end-journey.json). They cover tool selection, arguments, wrong-tool avoidance, clarification, uncertainty, state transitions, narrow disclosure, and route isolation.

## Browser setup

Use the ChatGPT/Codex in-app browser or a challenge-compatible Chrome build with WebMCP testing enabled at `chrome://flags/#enable-webmcp-testing`. Serve from localhost or HTTPS. The deployment and local Vite servers send:

```text
Origin-Agent-Cluster: ?1
Permissions-Policy: tools=(self)
```

Open the browser's WebMCP tooling to inspect each route's current semantic tools. Tools are rediscovered after navigation because old registrations are aborted.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

Netlify configuration includes SPA fallback for direct access to `/carry`, `/near`, and `/table`, plus the required WebMCP headers.

## Tested clients

- Codex/ChatGPT in-app browser with native WebMCP discovery and invocation
- Unsupported-browser path through deterministic component tests

## AI tools used

OpenAI Codex assisted with implementation, test authoring, browser verification, and submission drafting. CARRY itself has no LLM backend; the compatible browser agent is the AI participant.

## License

MIT. See [`LICENSE`](LICENSE).

