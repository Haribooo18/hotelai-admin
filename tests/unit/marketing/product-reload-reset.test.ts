import { describe, expect, it, vi } from "vitest";

import {
  MARKETING_PRODUCT_HASH,
  buildProductReloadResetScript,
  getNavigationType,
  isReloadNavigation,
  resetHomepageScrollOnReload,
  shouldResetProductHashOnReload,
  type ScrollResetWindowLike,
} from "@/lib/marketing/product-reload-reset";
import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

type ReplaceStateFn = (
  data: unknown,
  unused: string,
  url?: string | null
) => void;

type ScrollToFn = (options: {
  top?: number;
  left?: number;
  behavior?: "auto" | "instant" | "smooth";
}) => void;

type FakeWindow = Omit<ScrollResetWindowLike, "history" | "scrollTo"> & {
  history: {
    scrollRestoration: "auto" | "manual";
    replaceState: ReturnType<typeof vi.fn<ReplaceStateFn>>;
  };
  scrollTo: ReturnType<typeof vi.fn<ScrollToFn>>;
};

function createFakeWindow(
  overrides: Partial<{
    navigationType: string | undefined;
    hash: string;
  }> = {}
): FakeWindow {
  const { navigationType, hash = "" } = overrides;

  const replaceState = vi.fn<ReplaceStateFn>();
  const scrollTo = vi.fn<ScrollToFn>();

  return {
    performance: {
      getEntriesByType: () =>
        navigationType === undefined ? [] : [{ type: navigationType }],
    },
    location: { hash },
    history: {
      scrollRestoration: "auto",
      replaceState,
    },
    scrollTo,
    requestAnimationFrame: (callback: (time: number) => void) => {
      callback(0);
      return 1;
    },
    cancelAnimationFrame: vi.fn(),
    setTimeout: ((callback: () => void) => {
      callback();
      return 1;
    }) as ScrollResetWindowLike["setTimeout"],
    clearTimeout: vi.fn(),
  };
}

describe("isReloadNavigation", () => {
  it("returns true only for a real reload navigation type", () => {
    expect(
      isReloadNavigation({
        getEntriesByType: () => [{ type: "reload" }],
      })
    ).toBe(true);
  });

  it("returns false for the initial visit, client navigation, and back/forward", () => {
    expect(
      isReloadNavigation({
        getEntriesByType: () => [{ type: "navigate" }],
      })
    ).toBe(false);

    expect(
      isReloadNavigation({
        getEntriesByType: () => [{ type: "back_forward" }],
      })
    ).toBe(false);

    expect(
      isReloadNavigation({
        getEntriesByType: () => [],
      })
    ).toBe(false);

    expect(isReloadNavigation(undefined)).toBe(false);
  });

  it("never throws when the Navigation Timing API is unavailable", () => {
    expect(
      isReloadNavigation({
        getEntriesByType: () => {
          throw new Error("not supported");
        },
      })
    ).toBe(false);

    expect(getNavigationType(undefined)).toBeUndefined();
  });
});

describe("resetHomepageScrollOnReload", () => {
  it("does nothing when the navigation is not a reload", () => {
    const fakeWindow = createFakeWindow({
      navigationType: "navigate",
    });

    const cleanup = resetHomepageScrollOnReload(fakeWindow);

    expect(cleanup).toBeUndefined();
    expect(fakeWindow.history.replaceState).not.toHaveBeenCalled();
    expect(fakeWindow.scrollTo).not.toHaveBeenCalled();
    expect(fakeWindow.history.scrollRestoration).toBe("auto");
  });

  it("normalizes a reload of /#product to / and forces scroll to top", () => {
    const fakeWindow = createFakeWindow({
      navigationType: "reload",
      hash: "#product",
    });

    resetHomepageScrollOnReload(fakeWindow);

    expect(fakeWindow.history.replaceState).toHaveBeenCalledTimes(1);
    expect(fakeWindow.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/"
    );
    expect(fakeWindow.history.scrollRestoration).toBe("manual");
    expect(fakeWindow.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    // Immediate call + requestAnimationFrame callback + timeout callback.
    expect(fakeWindow.scrollTo).toHaveBeenCalledTimes(3);
  });

  it("sets scroll restoration to manual on reload without the product hash", () => {
    const fakeWindow = createFakeWindow({
      navigationType: "reload",
      hash: "",
    });

    resetHomepageScrollOnReload(fakeWindow);

    expect(fakeWindow.history.scrollRestoration).toBe("manual");
    expect(fakeWindow.history.replaceState).not.toHaveBeenCalled();
    expect(fakeWindow.scrollTo).toHaveBeenCalled();
  });

  it("never produces a duplicated hash when invoked repeatedly", () => {
    const fakeWindow = createFakeWindow({
      navigationType: "reload",
      hash: "#product",
    });

    resetHomepageScrollOnReload(fakeWindow);
    resetHomepageScrollOnReload(fakeWindow);
    resetHomepageScrollOnReload(fakeWindow);

    for (const call of fakeWindow.history.replaceState.mock.calls) {
      expect(call).toEqual([null, "", "/"]);
    }
  });

  it("restores the previous scroll restoration value on cleanup", () => {
    const fakeWindow = createFakeWindow({
      navigationType: "reload",
    });

    fakeWindow.history.scrollRestoration = "auto";

    const cleanup = resetHomepageScrollOnReload(fakeWindow);

    expect(fakeWindow.history.scrollRestoration).toBe("manual");

    cleanup?.();

    expect(fakeWindow.history.scrollRestoration).toBe("auto");
  });
});

describe("shouldResetProductHashOnReload", () => {
  it("resets only on a real reload of the homepage with the product hash", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/",
        hash: "#product",
        navigationType: "reload",
      })
    ).toBe(true);
  });

  it("does nothing for normal client-side navigation", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/",
        hash: "#product",
        navigationType: "navigate",
      })
    ).toBe(false);
  });

  it("does nothing for browser back/forward navigation", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/",
        hash: "#product",
        navigationType: "back_forward",
      })
    ).toBe(false);
  });

  it("does nothing when the navigation type is unknown", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/",
        hash: "#product",
        navigationType: undefined,
      })
    ).toBe(false);
  });

  it("does nothing when reloading without the product hash", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/",
        hash: "",
        navigationType: "reload",
      })
    ).toBe(false);
  });

  it("does nothing when reloading a different page", () => {
    expect(
      shouldResetProductHashOnReload({
        pathname: "/pricing",
        hash: "#product",
        navigationType: "reload",
      })
    ).toBe(false);
  });

  it("uses the same canonical hash as the Product nav destination", () => {
    expect(MARKETING_PRODUCT_HREF).toBe(`/${MARKETING_PRODUCT_HASH}`);
  });
});

describe("buildProductReloadResetScript", () => {
  it("embeds the canonical product hash and reload detection", () => {
    const script = buildProductReloadResetScript();

    expect(script).toContain('"#product"');
    expect(script).toContain('getEntriesByType("navigation")');
    expect(script).toContain('navType!=="reload"');
    expect(script).toContain(
      'window.history.replaceState(null,"","/")'
    );
    expect(script).toContain(
      'window.scrollTo({top:0,left:0,behavior:"auto"})'
    );
  });

  it("gates hash removal behind pathname and reload checks", () => {
    const script = buildProductReloadResetScript();

    const replaceStateIndex = script.indexOf(
      "window.history.replaceState"
    );
    const pathnameGuardIndex = script.indexOf(
      "window.location.pathname"
    );
    const navTypeGuardIndex = script.indexOf(
      'navType!=="reload"'
    );

    expect(pathnameGuardIndex).toBeGreaterThanOrEqual(0);
    expect(navTypeGuardIndex).toBeGreaterThan(pathnameGuardIndex);
    expect(replaceStateIndex).toBeGreaterThan(navTypeGuardIndex);
  });

  it("is deterministic across repeated calls", () => {
    const first = buildProductReloadResetScript();
    const second = buildProductReloadResetScript();
    const third = buildProductReloadResetScript();

    expect(first).toBe(second);
    expect(second).toBe(third);
    expect(first).not.toMatch(/#.*#/);
  });

  it("wraps everything in a try/catch", () => {
    const script = buildProductReloadResetScript();

    expect(script.startsWith("(function(){try{")).toBe(true);
    expect(script).toContain("}catch(e){}})();");
  });
});