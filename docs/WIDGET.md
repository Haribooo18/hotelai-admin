# HotelAI Website Widget

Embeddable chat widget for customer websites. The widget is a **client transport layer only** — it sends guest messages to the existing Website Chat SSE endpoint and renders streaming AI replies. All AI logic stays in `streamAIResponseForHotel()` → `AIOrchestrator.stream()`.

---

## Installation

Add the script to any page on the customer site:

```html
<script src="https://your-domain/widget.js"></script>
<script>
  HotelAI.init({
    hotelId: "hotel_aurora",
    apiUrl: "https://your-domain",
    theme: "dark",
    position: "right",
    primaryColor: "#10b981",
  });
</script>
```

### Configuration

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `hotelId` | Yes | — | Public tenant id (routes messages to the correct hotel) |
| `apiUrl` | Yes | — | HotelAI deployment origin (no trailing slash required) |
| `theme` | No | `"light"` | `"light"` or `"dark"` |
| `position` | No | `"right"` | Launcher position: `"left"` or `"right"` |
| `primaryColor` | No | `"#10b981"` | Accent color for launcher and guest bubbles |
| `guestName` | No | `"Website Guest"` | Display name sent with guest messages |
| `onOpen` | No | — | Callback when chat panel opens |
| `onClose` | No | — | Callback when chat panel closes |
| `onMessage` | No | — | Callback when a message is rendered |
| `onError` | No | — | Callback on transport or server errors |

Only `window.HotelAI.init()` is exposed in the production bundle.

---

## Transport flow

```
Customer website (widget.js)
  └─ POST /api/channels/website/stream
       ├─ JSON guest_message frame (session_id, message_id, body, hotel_id)
       ├─ SSE response (ack, status, text_delta, text_final, done, error)
       └─ Server: handleWebsiteStream()
            └─ streamAIResponseForHotel()
                 └─ AIOrchestrator.stream()
```

The widget does **not** call any other AI endpoints.

### Guest message frame

```json
{
  "type": "guest_message",
  "session_id": "uuid-persisted-in-localStorage",
  "message_id": "uuid-per-message",
  "guest_name": "Website Guest",
  "body": "Есть ли парковка?",
  "hotel_id": "hotel_aurora"
}
```

### SSE events

| Event | Purpose |
|-------|---------|
| `ack` | Guest message persisted, conversation linked |
| `status` | AI typing (`ai_answering`, `tool_calls`) |
| `text_delta` | Streaming token chunk |
| `text_final` | Final assistant text |
| `done` | Stream complete |
| `ai_disabled` | AI not enabled for hotel |
| `error` | User-facing error message |

---

## Session persistence

- `session_id` is generated on first load and stored in `localStorage` under `hotelai:widget:session:{hotelId}`.
- The same browser session reuses the conversation after refresh.
- Reconnect: a new stream aborts the previous in-flight request; the server cleans up typing state on disconnect.

---

## Security

- **No secrets** in the widget bundle — only public `hotelId` and `apiUrl`.
- **No `innerHTML`** — messages render via `textContent` only.
- **CORS** — cross-origin embeds must match `WEBSITE_WIDGET_ALLOWED_ORIGINS` (403 otherwise).
- **`hotel_id` required** — unknown hotels return `404 { "error": "Unknown hotel" }` (no env fallback).
- **Rate limiting** — per `session_id` and client IP (429 with `Retry-After`).
- **Message validation** — empty, oversized, invalid UTF-8, or wrong frame type → 400 JSON.
- **Error sanitization** — no stack traces or internal details returned to the browser.

---

## Production configuration

Set these server env vars before exposing the widget on customer sites:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEBSITE_WIDGET_ALLOWED_ORIGINS` | Yes (prod) | — | Multiline origin whitelist (`https://hotel-one.com`, `https://*.hotelai.app`) |
| `WEBSITE_WIDGET_SESSION_RATE_LIMIT` | No | `30` | Max requests per minute per `session_id` |
| `WEBSITE_WIDGET_IP_RATE_LIMIT` | No | `60` | Max requests per minute per client IP |
| `WEBSITE_WIDGET_MAX_MESSAGE_LENGTH` | No | `4000` | Max guest message length (chars) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Hotel lookup + message persistence |

**Local development:** `NODE_ENV=development` allows `http://localhost:*` and `http://127.0.0.1:*` without listing them.

**CORS example:**

```env
WEBSITE_WIDGET_ALLOWED_ORIGINS=https://aurora-hotel.com
https://www.aurora-hotel.com
https://*.hotelai.app
```

Requests with a disallowed `Origin` header receive `403 { "error": "Origin not allowed" }`.

---

## Resilience

- **Reconnect backoff** — transient transport failures retry with 1s → 2s → 4s → 8s → 16s → 30s delays (max 6 attempts). Resets after success. Non-retryable errors (400, 403, 404, 429) fail immediately.
- **Double init** — calling `HotelAI.init()` twice destroys the previous instance and removes orphaned DOM nodes.
- **Stream cleanup** — server always calls `cleanupWebsiteStream()` on completion, abort, cancel, or error.

---

## Observability

Server logs use the `[HotelAI widget]` prefix. Events logged (no message bodies):

- `connection_start` / `connection_end`
- `disconnect` (with reason: `aborted`, `cancelled`, `error`, `processing_error`)
- `rate_limited`
- `invalid_hotel`
- `invalid_origin`

---

## Development

Source lives in `src/widget/`:

```
src/widget/
  embed.ts      # Production bundle entry (exports init only)
  index.ts      # init(), config normalization
  client.ts     # Session, serialization, SSE transport
  events.ts     # onOpen/onClose/onMessage/onError bus
  ui.ts         # Floating launcher + chat panel DOM
  styles.css    # Scoped plain CSS (no Tailwind)
  types.ts
```

Build the browser bundle:

```bash
npm run build:widget
```

Output: `public/widget.js` (served statically by Next.js).

Full production build includes the widget:

```bash
npm run build
```

---

## Local testing

1. Run `npm run dev`.
2. Create a static HTML page that loads `http://localhost:3000/widget.js`.
3. Initialize with your seeded `hotelId` and `apiUrl: "http://localhost:3000"`.
4. Enable AI for the hotel in `/settings`.

Example curl (same transport as the widget):

```bash
curl -N -X POST "http://localhost:3000/api/channels/website/stream" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "guest_message",
    "session_id": "test-session",
    "message_id": "test-msg-1",
    "guest_name": "Website Guest",
    "body": "Есть ли завтрак?",
    "hotel_id": "hotel_aurora"
  }'
```

---

## Tests

Unit tests in `tests/unit/widget/` cover:

- Session persistence (`localStorage` key per hotel)
- Message frame serialization
- Event callback wiring
- Init config validation and double-init guard
- SSE chunk parsing, fetch transport, and reconnect backoff
- CORS origin whitelist, hotel validation, rate limiting, payload validation

Server tests in `tests/unit/channels/website/` cover guards, CORS, validation, and rate limits.

Run: `npm run test`
