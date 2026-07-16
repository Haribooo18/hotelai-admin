import {
  buildGuestMessageFrame,
  createMessageId,
  getOrCreateSessionId,
  streamGuestMessageWithRetry,
} from "./client";
import { bindWidgetCallbacks, createWidgetEventBus } from "./events";
import widgetStyles from "./styles.css";
import type {
  WidgetConfig,
  WidgetMessage,
  WebsiteStreamEvent,
} from "./types";

const STYLE_ELEMENT_ID = "hotelai-widget-styles";

function injectStyles(): void {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = widgetStyles;
  document.head.appendChild(style);
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function setText(element: Element, text: string): void {
  element.textContent = text;
}

export class WidgetUI {
  private readonly config: WidgetConfig;
  private readonly bus = createWidgetEventBus();
  private readonly sessionId: string;
  private readonly root: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly messages: HTMLDivElement;
  private readonly typing: HTMLDivElement;
  private readonly input: HTMLTextAreaElement;
  private readonly sendButton: HTMLButtonElement;
  private readonly errorBar: HTMLDivElement;
  private readonly launcher: HTMLButtonElement;
  private streamAbort: AbortController | null = null;
  private assistantDraftId: string | null = null;
  private isOpen = false;
  private isSending = false;
  private unbindCallbacks: (() => void) | null = null;

  constructor(config: WidgetConfig) {
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

  mount(): void {
    if (this.root.isConnected) {
      return;
    }

    injectStyles();
    this.unbindCallbacks = bindWidgetCallbacks(this.bus, this.config);
    this.applyTheme();
    this.buildLayout();
    document.body.appendChild(this.root);
  }

  destroy(): void {
    this.streamAbort?.abort();
    this.streamAbort = null;
    this.unbindCallbacks?.();
    this.bus.clear();

    if (this.root.isConnected) {
      this.root.remove();
    }
  }

  private applyTheme(): void {
    this.root.dataset.theme = this.config.theme ?? "light";
    this.root.dataset.position = this.config.position ?? "right";
    this.root.dataset.open = "false";
    this.root.style.setProperty(
      "--hotelai-primary",
      this.config.primaryColor ?? "#10b981"
    );
  }

  private buildLayout(): void {
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
    this.launcher.setAttribute("aria-label", "Открыть чат Monavel");
    this.launcher.addEventListener("click", () => this.toggle(true));

    const header = createElement("div", "hotelai-widget__header");
    const headerText = createElement("div");
    const title = createElement("p", "hotelai-widget__title");
    const subtitle = createElement("p", "hotelai-widget__subtitle");
    setText(title, "Monavel");
    setText(subtitle, "AI-ресепшн отеля");
    headerText.appendChild(title);
    headerText.appendChild(subtitle);

    const closeButton = createElement("button", "hotelai-widget__close");
    closeButton.setAttribute("aria-label", "Закрыть чат");
    setText(closeButton, "×");
    closeButton.addEventListener("click", () => this.toggle(false));

    header.appendChild(headerText);
    header.appendChild(closeButton);

    for (let i = 0; i < 3; i += 1) {
      this.typing.appendChild(createElement("span", "hotelai-widget__typing-dot"));
    }

    this.input.setAttribute("rows", "1");
    this.input.setAttribute("placeholder", "Напишите сообщение...");
    this.input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void this.handleSend();
      }
    });

    setText(this.sendButton, "Отправить");
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
      "Здравствуйте! Я AI-ресепшн отеля. Чем могу помочь?",
      false
    );
  }

  private toggle(open: boolean): void {
    this.isOpen = open;
    this.root.dataset.open = open ? "true" : "false";

    if (open) {
      this.bus.emit("open", undefined);
      this.input.focus();
    } else {
      this.bus.emit("close", undefined);
    }
  }

  private appendMessage(message: WidgetMessage): HTMLDivElement {
    const bubble = createElement("div", "hotelai-widget__message");
    bubble.classList.add(
      message.role === "guest"
        ? "hotelai-widget__message--guest"
        : "hotelai-widget__message--assistant"
    );
    bubble.dataset.messageId = message.id;
    setText(bubble, message.content);
    this.messages.insertBefore(bubble, this.typing);
    this.scrollToBottom();
    this.bus.emit("message", message);
    return bubble;
  }

  private appendAssistantMessage(content: string, emitEvent: boolean): string {
    const message: WidgetMessage = {
      id: createMessageId(),
      role: "assistant",
      content,
      timestamp: Date.now(),
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

  private scrollToBottom(): void {
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  private setTyping(visible: boolean): void {
    this.typing.dataset.visible = visible ? "true" : "false";
    if (visible) {
      this.scrollToBottom();
    }
  }

  private setError(message: string | null): void {
    if (!message) {
      this.errorBar.dataset.visible = "false";
      setText(this.errorBar, "");
      return;
    }

    this.errorBar.dataset.visible = "true";
    setText(this.errorBar, message);
    this.bus.emit("error", message);
  }

  private setSendingState(sending: boolean): void {
    this.isSending = sending;
    this.sendButton.disabled = sending;
    this.input.disabled = sending;
  }

  private async handleSend(): Promise<void> {
    const body = this.input.value.trim();
    if (!body || this.isSending) {
      return;
    }

    this.input.value = "";
    this.setError(null);

    const guestMessage: WidgetMessage = {
      id: createMessageId(),
      role: "guest",
      content: body,
      timestamp: Date.now(),
    };
    this.appendMessage(guestMessage);

    this.streamAbort?.abort();
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
        onEvent: (event) => this.handleStreamEvent(event),
      });
    } catch (error) {
      if (this.streamAbort.signal.aborted) {
        return;
      }

      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Ошибка отправки сообщения";
      this.setError(message);
    } finally {
      this.setTyping(false);
      this.setSendingState(false);
      this.assistantDraftId = null;
    }
  }

  private handleStreamEvent(event: WebsiteStreamEvent): void {
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
          const current = draft.textContent ?? "";
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
          "AI-ресепшн сейчас недоступен. Попробуйте позже.",
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
}
