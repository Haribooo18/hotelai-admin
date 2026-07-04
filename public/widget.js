"use strict";
var HotelAI = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/widget/embed.ts
  var embed_exports = {};
  __export(embed_exports, {
    init: () => init
  });

  // src/widget/reconnect.ts
  var BACKOFF_DELAYS_MS = [1e3, 2e3, 4e3, 8e3, 16e3, 3e4];
  function createReconnectBackoff() {
    let attempt = 0;
    return {
      nextDelay() {
        const delay = BACKOFF_DELAYS_MS[Math.min(attempt, BACKOFF_DELAYS_MS.length - 1)];
        attempt += 1;
        return delay;
      },
      reset() {
        attempt = 0;
      },
      getAttempt() {
        return attempt;
      }
    };
  }
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // src/widget/client.ts
  var SESSION_STORAGE_PREFIX = "hotelai:widget:session:";
  function getSessionStorageKey(hotelId) {
    return `${SESSION_STORAGE_PREFIX}${hotelId}`;
  }
  function getOrCreateSessionId(hotelId, storage = localStorage) {
    var _a;
    const key = getSessionStorageKey(hotelId);
    const existing = (_a = storage.getItem(key)) == null ? void 0 : _a.trim();
    if (existing) {
      return existing;
    }
    const sessionId = createSessionId();
    storage.setItem(key, sessionId);
    return sessionId;
  }
  function createSessionId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function createMessageId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function buildGuestMessageFrame(config, sessionId, body, messageId = createMessageId()) {
    var _a;
    const trimmedBody = body.trim();
    const guestName = ((_a = config.guestName) == null ? void 0 : _a.trim()) || "Website Guest";
    return {
      type: "guest_message",
      session_id: sessionId,
      message_id: messageId,
      guest_name: guestName,
      body: trimmedBody,
      hotel_id: config.hotelId
    };
  }
  function normalizeApiUrl(apiUrl) {
    return apiUrl.replace(/\/+$/, "");
  }
  function buildStreamUrl(apiUrl) {
    return `${normalizeApiUrl(apiUrl)}/api/channels/website/stream`;
  }
  function parseWebsiteStreamEvent(raw) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "[DONE]") {
      return null;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== "object" || parsed === null || !("type" in parsed)) {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function parseSSEChunk(buffer) {
    var _a;
    const events = [];
    const lines = buffer.split("\n");
    const remainder = (_a = lines.pop()) != null ? _a : "";
    for (const line of lines) {
      if (!line.startsWith("data:")) {
        continue;
      }
      const payload = line.slice(5).trim();
      const event = parseWebsiteStreamEvent(payload);
      if (event) {
        events.push(event);
      }
    }
    return { events, remainder };
  }
  function createStreamTransportError(message, status) {
    return {
      message,
      status,
      retryable: status >= 500 || status === 0
    };
  }
  async function readStreamErrorMessage(response) {
    try {
      const payload = await response.json();
      if (typeof payload.error === "string" && payload.error.trim()) {
        return payload.error;
      }
    } catch (e) {
    }
    return `\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F (${response.status})`;
  }
  async function streamGuestMessage(options) {
    var _a;
    const fetchFn = (_a = options.fetchImpl) != null ? _a : fetch;
    const response = await fetchFn(buildStreamUrl(options.apiUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream"
      },
      body: JSON.stringify(options.frame),
      signal: options.signal
    });
    if (!response.ok) {
      const message = await readStreamErrorMessage(response);
      throw createStreamTransportError(message, response.status);
    }
    if (!response.body) {
      throw createStreamTransportError("\u041F\u043E\u0442\u043E\u043A \u043E\u0442\u0432\u0435\u0442\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D", 0);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSSEChunk(buffer);
      buffer = parsed.remainder;
      for (const event of parsed.events) {
        options.onEvent(event);
      }
    }
    if (buffer.trim()) {
      const parsed = parseSSEChunk(`${buffer}
`);
      for (const event of parsed.events) {
        options.onEvent(event);
      }
    }
  }
  async function streamGuestMessageWithRetry(options) {
    var _a, _b, _c;
    const backoff = createReconnectBackoff();
    const maxAttempts = (_a = options.maxAttempts) != null ? _a : 6;
    while (true) {
      try {
        await streamGuestMessage(options);
        backoff.reset();
        return;
      } catch (error) {
        if ((_b = options.signal) == null ? void 0 : _b.aborted) {
          throw error;
        }
        const transportError = error;
        const retryable = typeof transportError.retryable === "boolean" ? transportError.retryable : false;
        if (!retryable || backoff.getAttempt() >= maxAttempts - 1) {
          throw error;
        }
        const delayMs = backoff.nextDelay();
        (_c = options.onRetry) == null ? void 0 : _c.call(options, delayMs, backoff.getAttempt());
        await sleep(delayMs);
      }
    }
  }

  // src/widget/events.ts
  function createWidgetEventBus() {
    const handlers = /* @__PURE__ */ new Map();
    return {
      on(event, handler) {
        var _a;
        const bucket = (_a = handlers.get(event)) != null ? _a : /* @__PURE__ */ new Set();
        bucket.add(handler);
        handlers.set(event, bucket);
        return () => {
          bucket.delete(handler);
        };
      },
      emit(event, payload) {
        const bucket = handlers.get(event);
        if (!bucket) return;
        for (const handler of bucket) {
          handler(payload);
        }
      },
      clear() {
        handlers.clear();
      }
    };
  }
  function bindWidgetCallbacks(bus, callbacks) {
    const unsubs = [];
    if (callbacks.onOpen) {
      unsubs.push(bus.on("open", callbacks.onOpen));
    }
    if (callbacks.onClose) {
      unsubs.push(bus.on("close", callbacks.onClose));
    }
    if (callbacks.onMessage) {
      unsubs.push(bus.on("message", callbacks.onMessage));
    }
    if (callbacks.onError) {
      unsubs.push(bus.on("error", callbacks.onError));
    }
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }

  // src/widget/styles.css
  var styles_default = '.hotelai-widget {\n  --hotelai-primary: #10b981;\n  --hotelai-bg: #ffffff;\n  --hotelai-surface: #f4f4f5;\n  --hotelai-text: #18181b;\n  --hotelai-muted: #71717a;\n  --hotelai-border: #e4e4e7;\n  --hotelai-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);\n  --hotelai-radius: 16px;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  line-height: 1.5;\n  color: var(--hotelai-text);\n}\n\n.hotelai-widget[data-theme="dark"] {\n  --hotelai-bg: #18181b;\n  --hotelai-surface: #27272a;\n  --hotelai-text: #fafafa;\n  --hotelai-muted: #a1a1aa;\n  --hotelai-border: #3f3f46;\n  --hotelai-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);\n}\n\n.hotelai-widget[data-position="left"] {\n  left: 20px;\n  right: auto;\n}\n\n.hotelai-widget[data-position="right"] {\n  right: 20px;\n  left: auto;\n}\n\n.hotelai-widget {\n  position: fixed;\n  bottom: 20px;\n  z-index: 2147483000;\n}\n\n.hotelai-widget__launcher {\n  width: 56px;\n  height: 56px;\n  border: none;\n  border-radius: 999px;\n  background: var(--hotelai-primary);\n  color: #ffffff;\n  cursor: pointer;\n  box-shadow: var(--hotelai-shadow);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.2s ease;\n}\n\n.hotelai-widget__launcher:hover {\n  transform: scale(1.04);\n}\n\n.hotelai-widget__launcher-icon {\n  width: 24px;\n  height: 24px;\n  fill: currentColor;\n}\n\n.hotelai-widget__panel {\n  position: absolute;\n  bottom: 72px;\n  width: min(360px, calc(100vw - 32px));\n  height: 520px;\n  max-height: calc(100vh - 120px);\n  display: none;\n  flex-direction: column;\n  border-radius: var(--hotelai-radius);\n  overflow: hidden;\n  background: var(--hotelai-bg);\n  border: 1px solid var(--hotelai-border);\n  box-shadow: var(--hotelai-shadow);\n}\n\n.hotelai-widget[data-open="true"] .hotelai-widget__panel {\n  display: flex;\n}\n\n.hotelai-widget[data-position="left"] .hotelai-widget__panel {\n  left: 0;\n}\n\n.hotelai-widget[data-position="right"] .hotelai-widget__panel {\n  right: 0;\n}\n\n.hotelai-widget__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 16px;\n  background: var(--hotelai-primary);\n  color: #ffffff;\n}\n\n.hotelai-widget__title {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 600;\n}\n\n.hotelai-widget__subtitle {\n  margin: 2px 0 0;\n  font-size: 12px;\n  opacity: 0.9;\n}\n\n.hotelai-widget__close {\n  border: none;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  font-size: 20px;\n  line-height: 1;\n  padding: 4px;\n}\n\n.hotelai-widget__messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  background: var(--hotelai-surface);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.hotelai-widget__message {\n  max-width: 85%;\n  padding: 10px 12px;\n  border-radius: 14px;\n  font-size: 14px;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n.hotelai-widget__message--guest {\n  align-self: flex-end;\n  background: var(--hotelai-primary);\n  color: #ffffff;\n  border-bottom-right-radius: 4px;\n}\n\n.hotelai-widget__message--assistant {\n  align-self: flex-start;\n  background: var(--hotelai-bg);\n  color: var(--hotelai-text);\n  border: 1px solid var(--hotelai-border);\n  border-bottom-left-radius: 4px;\n}\n\n.hotelai-widget__typing {\n  align-self: flex-start;\n  display: none;\n  gap: 4px;\n  padding: 10px 12px;\n  border-radius: 14px;\n  background: var(--hotelai-bg);\n  border: 1px solid var(--hotelai-border);\n}\n\n.hotelai-widget__typing[data-visible="true"] {\n  display: inline-flex;\n}\n\n.hotelai-widget__typing-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 999px;\n  background: var(--hotelai-muted);\n  animation: hotelai-typing 1.2s infinite ease-in-out;\n}\n\n.hotelai-widget__typing-dot:nth-child(2) {\n  animation-delay: 0.15s;\n}\n\n.hotelai-widget__typing-dot:nth-child(3) {\n  animation-delay: 0.3s;\n}\n\n@keyframes hotelai-typing {\n  0%,\n  80%,\n  100% {\n    opacity: 0.35;\n    transform: translateY(0);\n  }\n  40% {\n    opacity: 1;\n    transform: translateY(-2px);\n  }\n}\n\n.hotelai-widget__composer {\n  display: flex;\n  gap: 8px;\n  padding: 12px;\n  border-top: 1px solid var(--hotelai-border);\n  background: var(--hotelai-bg);\n}\n\n.hotelai-widget__input {\n  flex: 1;\n  min-height: 40px;\n  max-height: 96px;\n  resize: none;\n  border: 1px solid var(--hotelai-border);\n  border-radius: 12px;\n  padding: 10px 12px;\n  font: inherit;\n  color: var(--hotelai-text);\n  background: var(--hotelai-surface);\n}\n\n.hotelai-widget__input:focus {\n  outline: 2px solid color-mix(in srgb, var(--hotelai-primary) 35%, transparent);\n  border-color: var(--hotelai-primary);\n}\n\n.hotelai-widget__send {\n  border: none;\n  border-radius: 12px;\n  padding: 0 14px;\n  background: var(--hotelai-primary);\n  color: #ffffff;\n  font: inherit;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.hotelai-widget__send:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.hotelai-widget__error {\n  display: none;\n  padding: 8px 12px;\n  font-size: 12px;\n  color: #b91c1c;\n  background: #fef2f2;\n  border-top: 1px solid #fecaca;\n}\n\n.hotelai-widget[data-theme="dark"] .hotelai-widget__error {\n  color: #fecaca;\n  background: #450a0a;\n  border-top-color: #7f1d1d;\n}\n\n.hotelai-widget__error[data-visible="true"] {\n  display: block;\n}\n\n@media (max-width: 480px) {\n  .hotelai-widget__panel {\n    width: calc(100vw - 24px);\n    height: min(70vh, 520px);\n  }\n}\n';

  // src/widget/ui.ts
  var STYLE_ELEMENT_ID = "hotelai-widget-styles";
  function injectStyles() {
    if (document.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ELEMENT_ID;
    style.textContent = styles_default;
    document.head.appendChild(style);
  }
  function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    return element;
  }
  function setText(element, text) {
    element.textContent = text;
  }
  var WidgetUI = class {
    constructor(config) {
      this.bus = createWidgetEventBus();
      this.streamAbort = null;
      this.assistantDraftId = null;
      this.isOpen = false;
      this.isSending = false;
      this.unbindCallbacks = null;
      this.config = config;
      this.sessionId = getOrCreateSessionId(config.hotelId);
      this.root = createElement("div", "hotelai-widget");
      this.panel = createElement("div", "hotelai-widget__panel");
      this.messages = createElement("div", "hotelai-widget__messages");
      this.typing = createElement("div", "hotelai-widget__typing");
      this.input = createElement("textarea", "hotelai-widget__input");
      this.sendButton = createElement("button", "hotelai-widget__send");
      this.errorBar = createElement("div", "hotelai-widget__error");
      this.launcher = createElement("button", "hotelai-widget__launcher");
    }
    mount() {
      if (this.root.isConnected) {
        return;
      }
      injectStyles();
      this.unbindCallbacks = bindWidgetCallbacks(this.bus, this.config);
      this.applyTheme();
      this.buildLayout();
      document.body.appendChild(this.root);
    }
    destroy() {
      var _a, _b;
      (_a = this.streamAbort) == null ? void 0 : _a.abort();
      this.streamAbort = null;
      (_b = this.unbindCallbacks) == null ? void 0 : _b.call(this);
      this.bus.clear();
      if (this.root.isConnected) {
        this.root.remove();
      }
    }
    applyTheme() {
      var _a, _b, _c;
      this.root.dataset.theme = (_a = this.config.theme) != null ? _a : "light";
      this.root.dataset.position = (_b = this.config.position) != null ? _b : "right";
      this.root.dataset.open = "false";
      this.root.style.setProperty(
        "--hotelai-primary",
        (_c = this.config.primaryColor) != null ? _c : "#10b981"
      );
    }
    buildLayout() {
      setText(this.launcher, "");
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("class", "hotelai-widget__launcher-icon");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute(
        "d",
        "M12 3C7.03 3 3 6.58 3 11c0 1.86.74 3.58 2 4.94V21l4.2-2.31c.9.17 1.84.26 2.8.26 4.97 0 9-3.58 9-8s-4.03-8-9-8z"
      );
      icon.appendChild(path);
      this.launcher.appendChild(icon);
      this.launcher.setAttribute("aria-label", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0447\u0430\u0442 HotelAI");
      this.launcher.addEventListener("click", () => this.toggle(true));
      const header = createElement("div", "hotelai-widget__header");
      const headerText = createElement("div");
      const title = createElement("p", "hotelai-widget__title");
      const subtitle = createElement("p", "hotelai-widget__subtitle");
      setText(title, "HotelAI");
      setText(subtitle, "AI-\u0440\u0435\u0441\u0435\u043F\u0448\u043D \u043E\u0442\u0435\u043B\u044F");
      headerText.appendChild(title);
      headerText.appendChild(subtitle);
      const closeButton = createElement("button", "hotelai-widget__close");
      closeButton.setAttribute("aria-label", "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0447\u0430\u0442");
      setText(closeButton, "\xD7");
      closeButton.addEventListener("click", () => this.toggle(false));
      header.appendChild(headerText);
      header.appendChild(closeButton);
      for (let i = 0; i < 3; i += 1) {
        this.typing.appendChild(createElement("span", "hotelai-widget__typing-dot"));
      }
      this.input.setAttribute("rows", "1");
      this.input.setAttribute("placeholder", "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...");
      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          void this.handleSend();
        }
      });
      setText(this.sendButton, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C");
      this.sendButton.addEventListener("click", () => {
        void this.handleSend();
      });
      const composer = createElement("div", "hotelai-widget__composer");
      composer.appendChild(this.input);
      composer.appendChild(this.sendButton);
      this.panel.appendChild(header);
      this.panel.appendChild(this.messages);
      this.messages.appendChild(this.typing);
      this.panel.appendChild(this.errorBar);
      this.panel.appendChild(composer);
      this.root.appendChild(this.panel);
      this.root.appendChild(this.launcher);
      this.appendAssistantMessage(
        "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u042F AI-\u0440\u0435\u0441\u0435\u043F\u0448\u043D \u043E\u0442\u0435\u043B\u044F. \u0427\u0435\u043C \u043C\u043E\u0433\u0443 \u043F\u043E\u043C\u043E\u0447\u044C?",
        false
      );
    }
    toggle(open) {
      this.isOpen = open;
      this.root.dataset.open = open ? "true" : "false";
      if (open) {
        this.bus.emit("open", void 0);
        this.input.focus();
      } else {
        this.bus.emit("close", void 0);
      }
    }
    appendMessage(message) {
      const bubble = createElement("div", "hotelai-widget__message");
      bubble.classList.add(
        message.role === "guest" ? "hotelai-widget__message--guest" : "hotelai-widget__message--assistant"
      );
      bubble.dataset.messageId = message.id;
      setText(bubble, message.content);
      this.messages.insertBefore(bubble, this.typing);
      this.scrollToBottom();
      this.bus.emit("message", message);
      return bubble;
    }
    appendAssistantMessage(content, emitEvent) {
      const message = {
        id: createMessageId(),
        role: "assistant",
        content,
        timestamp: Date.now()
      };
      const bubble = createElement("div", "hotelai-widget__message hotelai-widget__message--assistant");
      bubble.dataset.messageId = message.id;
      setText(bubble, content);
      this.messages.insertBefore(bubble, this.typing);
      if (emitEvent) {
        this.bus.emit("message", message);
      }
      this.scrollToBottom();
      return message.id;
    }
    scrollToBottom() {
      this.messages.scrollTop = this.messages.scrollHeight;
    }
    setTyping(visible) {
      this.typing.dataset.visible = visible ? "true" : "false";
      if (visible) {
        this.scrollToBottom();
      }
    }
    setError(message) {
      if (!message) {
        this.errorBar.dataset.visible = "false";
        setText(this.errorBar, "");
        return;
      }
      this.errorBar.dataset.visible = "true";
      setText(this.errorBar, message);
      this.bus.emit("error", message);
    }
    setSendingState(sending) {
      this.isSending = sending;
      this.sendButton.disabled = sending;
      this.input.disabled = sending;
    }
    async handleSend() {
      var _a;
      const body = this.input.value.trim();
      if (!body || this.isSending) {
        return;
      }
      this.input.value = "";
      this.setError(null);
      const guestMessage = {
        id: createMessageId(),
        role: "guest",
        content: body,
        timestamp: Date.now()
      };
      this.appendMessage(guestMessage);
      (_a = this.streamAbort) == null ? void 0 : _a.abort();
      this.streamAbort = new AbortController();
      this.setSendingState(true);
      this.setTyping(true);
      this.assistantDraftId = null;
      const frame = buildGuestMessageFrame(
        this.config,
        this.sessionId,
        body,
        guestMessage.id
      );
      try {
        await streamGuestMessageWithRetry({
          apiUrl: this.config.apiUrl,
          frame,
          signal: this.streamAbort.signal,
          onEvent: (event) => this.handleStreamEvent(event)
        });
      } catch (error) {
        if (this.streamAbort.signal.aborted) {
          return;
        }
        const message = typeof error === "object" && error !== null && "message" in error && typeof error.message === "string" ? error.message : "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F";
        this.setError(message);
      } finally {
        this.setTyping(false);
        this.setSendingState(false);
        this.assistantDraftId = null;
      }
    }
    handleStreamEvent(event) {
      var _a;
      switch (event.type) {
        case "status":
          if (event.status === "ai_answering" || event.status === "tool_calls") {
            this.setTyping(true);
          }
          break;
        case "text_delta": {
          this.setTyping(false);
          if (!this.assistantDraftId) {
            this.assistantDraftId = this.appendAssistantMessage(event.delta, true);
            return;
          }
          const draft = this.messages.querySelector(
            `[data-message-id="${this.assistantDraftId}"]`
          );
          if (draft) {
            const current = (_a = draft.textContent) != null ? _a : "";
            setText(draft, current + event.delta);
            this.scrollToBottom();
          }
          break;
        }
        case "text_final": {
          this.setTyping(false);
          if (this.assistantDraftId) {
            const draft = this.messages.querySelector(
              `[data-message-id="${this.assistantDraftId}"]`
            );
            if (draft) {
              setText(draft, event.content);
              this.scrollToBottom();
            }
            this.assistantDraftId = null;
            return;
          }
          this.appendAssistantMessage(event.content, true);
          break;
        }
        case "ai_disabled":
          this.setTyping(false);
          this.appendAssistantMessage(
            "AI-\u0440\u0435\u0441\u0435\u043F\u0448\u043D \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435.",
            true
          );
          break;
        case "error":
          this.setTyping(false);
          this.setError(event.message);
          break;
        case "done":
        case "ack":
          break;
        default:
          break;
      }
    }
  };

  // src/widget/index.ts
  var WIDGET_ROOT_SELECTOR = ".hotelai-widget";
  var activeWidget = null;
  function removeOrphanedWidgets() {
    if (typeof document === "undefined") {
      return;
    }
    document.querySelectorAll(WIDGET_ROOT_SELECTOR).forEach((node) => {
      node.remove();
    });
  }
  function normalizeWidgetConfig(config) {
    var _a, _b, _c, _d, _e, _f;
    const hotelId = (_a = config.hotelId) == null ? void 0 : _a.trim();
    const apiUrl = (_b = config.apiUrl) == null ? void 0 : _b.trim();
    if (!hotelId) {
      throw new Error("hotelId is required");
    }
    if (!apiUrl) {
      throw new Error("apiUrl is required");
    }
    return __spreadProps(__spreadValues({}, config), {
      hotelId,
      apiUrl,
      theme: (_c = config.theme) != null ? _c : "light",
      position: (_d = config.position) != null ? _d : "right",
      primaryColor: (_e = config.primaryColor) != null ? _e : "#10b981",
      guestName: ((_f = config.guestName) == null ? void 0 : _f.trim()) || "Website Guest"
    });
  }
  function init(config) {
    if (typeof document === "undefined") {
      throw new Error("HotelAI widget requires a browser environment");
    }
    const normalized = normalizeWidgetConfig(config);
    removeOrphanedWidgets();
    if (activeWidget) {
      activeWidget.destroy();
      activeWidget = null;
    }
    activeWidget = new WidgetUI(normalized);
    activeWidget.mount();
  }
  return __toCommonJS(embed_exports);
})();
