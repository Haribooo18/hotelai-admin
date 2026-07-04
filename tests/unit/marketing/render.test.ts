import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  AIChannelsSection,
  FAQSection,
  FeaturesOverview,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  PricingOverview,
  PricingSection,
} from "@/components/marketing";

describe("marketing page rendering", () => {
  it("renders landing hero with trial CTA", () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection));

    expect(html).toContain("Автоматизируйте гостевой сервис");
    expect(html).toContain("Начать пробный период");
    expect(html).toContain("/settings?tab=billing");
  });

  it("renders landing sections", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FeaturesSection),
        React.createElement(HowItWorksSection),
        React.createElement(AIChannelsSection),
        React.createElement(PricingSection),
        React.createElement(FAQSection)
      )
    );

    expect(html).toContain("Возможности");
    expect(html).toContain("Как это работает");
    expect(html).toContain("AI-каналы");
    expect(html).toContain("Тарифы");
    expect(html).toContain("FAQ");
    expect(html).toContain("Telegram");
    expect(html).toContain("Analytics");
  });

  it("renders features overview page content", () => {
    const html = renderToStaticMarkup(React.createElement(FeaturesOverview));

    expect(html).toContain("Возможности HotelAI");
    expect(html).toContain("Записаться на демо");
    expect(html).toContain("mailto:demo@hotelai.com");
  });

  it("renders pricing overview from billing plans", () => {
    const html = renderToStaticMarkup(React.createElement(PricingOverview));

    expect(html).toContain("Тарифы");
    expect(html).toContain("Starter");
    expect(html).toContain("Pro");
    expect(html).toContain("Enterprise");
  });
});
