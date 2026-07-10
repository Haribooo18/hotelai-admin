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
  AIExperienceSection,
  PricingPreviewSection,
  PlatformPillarsSection,
  PlatformShowcaseSection,
  PricingOverview,
  PricingSection,
  TrustSection,
  FinalCtaSection,
  MarketingFooter,
  WorkspacePreview,
} from "@/components/marketing";

describe("marketing page rendering", () => {
  it("renders landing hero with trial CTA", () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection));

    expect(html).toContain("Операционная система для современного отеля");
    expect(html).toContain("Начать пробный период");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("app.monavel.com/ai");
  });

  it("renders platform showcase section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformShowcaseSection)
    );

    expect(html).toContain('id="platform-overview"');
    expect(html).toContain("Platform");
    expect(html).toContain("Connected by AI");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Reception AI");
    expect(html).toContain("app.monavel.com/dashboard");
    expect(html).toContain('role="list"');
  });

  it("renders workspace preview with product screenshot", () => {
    const html = renderToStaticMarkup(React.createElement(WorkspacePreview));

    expect(html).toContain('data-workspace="dashboard"');
    expect(html).toContain("app.monavel.com/dashboard");
    expect(html).toContain("Monavel dashboard");
    expect(html).toContain("/marketing/product/dashboard/screenshot.svg");
  });

  it("renders platform pillars section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformPillarsSection)
    );

    expect(html).toContain('id="platform-pillars"');
    expect(html).toContain("One platform. Three pillars.");
    expect(html).toContain("Run Operations");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Grow Revenue");
    expect(html).toContain('href="/features"');
    expect(html).toContain('href="/ai"');
    expect(html).toContain('href="/pricing"');
    expect(html).toContain("Learn more");
  });

  it("renders ai experience section", () => {
    const html = renderToStaticMarkup(React.createElement(AIExperienceSection));

    expect(html).toContain('id="ai-experience"');
    expect(html).toContain("AI that works before your team asks.");
    expect(html).toContain("Guest Communication");
    expect(html).toContain("Revenue Intelligence");
    expect(html).toContain("Raise weekend rates");
    expect(html).toContain("Expected impact");
    expect(html).toContain("High confidence");
    expect(html).toContain("app.monavel.com/ai");
    expect(html).toContain("/marketing/product/reception-ai/screenshot.svg");
  });

  it("renders pricing preview section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PricingPreviewSection)
    );

    expect(html).toContain('id="pricing-preview"');
    expect(html).toContain("Simple pricing.");
    expect(html).toContain("Built to grow with your hotel.");
    expect(html).toContain("Most popular");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Contact sales");
    expect(html).toContain('href="/pricing"');
    expect(html).toContain("View all pricing details");
    expect(html).toContain("Is there a free trial?");
  });

  it("renders trust section", () => {
    const html = renderToStaticMarkup(React.createElement(TrustSection));

    expect(html).toContain('id="trust"');
    expect(html).toContain("Why trust Monavel?");
    expect(html).toContain("Built for modern hotels");
    expect(html).toContain("AI-first architecture");
    expect(html).toContain("Secure by design");
    expect(html).toContain("Fast onboarding");
    expect(html).toContain("24/7 AI Reception");
    expect(html).toContain("Unified Workspace");
    expect(html).toContain("One Platform");
    expect(html).toContain("Cloud Native");
    expect(html).toContain('href="/security"');
    expect(html).toContain("Learn about our security");
  });

  it("renders final cta section", () => {
    const html = renderToStaticMarkup(React.createElement(FinalCtaSection));

    expect(html).toContain('id="final-cta"');
    expect(html).toContain("Ready to modernize your hotel?");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Book a demo");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("No self-hosting");
    expect(html).toContain("Telegram &amp; Website Chat");
    expect(html).toContain("Secure cloud platform");
  });

  it("renders premium marketing footer", () => {
    const html = renderToStaticMarkup(React.createElement(MarketingFooter));

    expect(html).toContain("The AI Operating System for Modern Hotels.");
    expect(html).toContain("Product");
    expect(html).toContain("Resources");
    expect(html).toContain("Company");
    expect(html).toContain('href="/features"');
    expect(html).toContain('href="/integrations"');
    expect(html).toContain('href="/docs"');
    expect(html).toContain('href="/about"');
    expect(html).toContain("© Monavel");
    expect(html).toContain("Built for modern hotels.");
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
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

    expect(html).toContain("Возможности Monavel");
    expect(html).toContain("Записаться на демо");
    expect(html).toContain("mailto:hello@monavel.app");
  });

  it("renders pricing overview from billing plans", () => {
    const html = renderToStaticMarkup(React.createElement(PricingOverview));

    expect(html).toContain("Тарифы");
    expect(html).toContain("Starter");
    expect(html).toContain("Pro");
    expect(html).toContain("Enterprise");
  });
});
