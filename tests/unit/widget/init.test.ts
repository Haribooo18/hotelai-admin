import { beforeEach, describe, expect, it, vi } from "vitest";

const { destroyMock, mountMock } = vi.hoisted(() => ({
  destroyMock: vi.fn(),
  mountMock: vi.fn(),
}));

vi.mock("@/src/widget/ui", () => ({
  WidgetUI: class {
    mount = mountMock;
    destroy = destroyMock;
    root = { isConnected: false };
  },
}));

import {
  __resetWidgetForTests,
  init,
  normalizeWidgetConfig,
} from "@/src/widget/index";

function installDocumentStub() {
  globalThis.document = {
    body: {
      innerHTML: "",
      appendChild: vi.fn(),
    },
    head: {
      appendChild: vi.fn(),
    },
    getElementById: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
  } as unknown as Document;
}

describe("widget initialization", () => {
  beforeEach(() => {
    __resetWidgetForTests();
    vi.clearAllMocks();
    installDocumentStub();
  });

  it("normalizes config defaults", () => {
    const normalized = normalizeWidgetConfig({
      hotelId: " hotel_aurora ",
      apiUrl: "https://hotelai.example",
    });

    expect(normalized).toMatchObject({
      hotelId: "hotel_aurora",
      apiUrl: "https://hotelai.example",
      theme: "light",
      position: "right",
      primaryColor: "#c8a25a",
      guestName: "Website Guest",
    });
  });

  it("requires hotelId and apiUrl", () => {
    expect(() =>
      normalizeWidgetConfig({ hotelId: "", apiUrl: "https://hotelai.example" })
    ).toThrow("hotelId is required");

    expect(() =>
      normalizeWidgetConfig({ hotelId: "hotel_aurora", apiUrl: " " })
    ).toThrow("apiUrl is required");
  });

  it("requires browser environment", () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error test-only document removal
    delete globalThis.document;

    expect(() =>
      init({
        hotelId: "hotel_aurora",
        apiUrl: "https://hotelai.example",
      })
    ).toThrow("browser environment");

    globalThis.document = originalDocument;
  });

  it("does not duplicate widget instances on double init", () => {
    const orphanNodes = [
      { remove: vi.fn() },
      { remove: vi.fn() },
    ];
    const querySelectorAll = vi.fn((selector: string) =>
      selector === ".hotelai-widget" ? orphanNodes : []
    );
    globalThis.document = {
      body: { innerHTML: "", appendChild: vi.fn() },
      head: { appendChild: vi.fn() },
      getElementById: vi.fn(() => null),
      querySelectorAll,
    } as unknown as Document;

    init({
      hotelId: "hotel_aurora",
      apiUrl: "https://hotelai.example",
    });

    init({
      hotelId: "hotel_aurora",
      apiUrl: "https://hotelai.example",
    });

    expect(orphanNodes.every((node) => node.remove.mock.calls.length > 0)).toBe(
      true
    );
    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(mountMock).toHaveBeenCalledTimes(2);
  });
});
