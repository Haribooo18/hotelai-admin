import { describe, expect, it } from "vitest";

import { SHELL_NAV_ITEMS } from "@/lib/dashboard/shell-nav";
import { resolvePageTitleKey } from "@/lib/i18n/shell-pages";
import { isMarketingPublicPath } from "@/lib/marketing/routes";
import { MARKETING_NAV } from "@/lib/marketing/site";

describe("AI navigation routing", () => {
  it("points public marketing header AI to /ai", () => {
    const ai = MARKETING_NAV.find((item) => item.label === "AI");
    expect(ai?.href).toBe("/ai");
  });

  it("keeps public /ai open without auth", () => {
    expect(isMarketingPublicPath("/ai")).toBe(true);
  });

  it("requires auth for the admin AI inbox at /app/ai", () => {
    expect(isMarketingPublicPath("/app/ai")).toBe(false);
    expect(
      SHELL_NAV_ITEMS.find((item) => item.labelKey === "nav.messages")?.href
    ).toBe("/app/ai");
    expect(resolvePageTitleKey("/app/ai")).toBe("messages");
  });
});
