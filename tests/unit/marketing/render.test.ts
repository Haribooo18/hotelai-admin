import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  AIChannelsSection,
  BlogComingSoonPage,
  FAQSection,
  FeaturesOverview,
  FeaturesPage,
  AiPage,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  HowMonavelWorksSection,
  OperationalScenarioSection,
  BusinessOutcomesSection,
  WhyHotelsNeedSection,
  WhoIsMonavelForSection,
  AIExperienceSection,
  PricingPreviewSection,
  PlatformOverviewSection,
  PlatformPillarsSection,
  PlatformShowcaseSection,
  PhilosophySection,
  StorytellingSection,
  PricingOverview,
  PricingPage,
  PricingSection,
  TrustSection,
  HomepageFaqSection,
  FinalCtaSection,
  ContactPage,
  SecurityPage,
  IntegrationsPage,
  DemoPage,
  AboutPage,
  DocsLandingPage,
  DocsArticlePage,
  LegalPage,
  MarketingFooter,
  WorkspacePreview,
} from "@/components/marketing";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/lib/marketing/legal";

describe("marketing page rendering", () => {
  it("renders landing hero with concept illustration", () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection));

    expect(html).toContain("Everything your hotel needs");
    expect(html).toContain("One intelligent operating system");
    expect(html).toContain("AI Operating System for hotels");
    expect(html).not.toContain("mkt-overline");
    expect(html).toContain("One Workspace");
    expect(html).toContain("Guest Communication");
    expect(html).toContain("Start free trial");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("mkt-architecture-diagram-v2");
    expect(html).toContain("MONAVEL");
    expect(html).toContain("AI Operating System");
    expect(html).toContain("GUEST CHANNELS");
    expect(html).toContain("HOTEL OPERATIONS");
    expect(html).toContain("One workspace");
    expect(html).toContain("One AI");
    expect(html).toContain("Live data");
    expect(html).not.toContain("Guest Profile");
    expect(html).toContain("Real-time");
    expect(html).toContain("Security");
    expect(html).toContain("Automation");
    expect(html).not.toContain("Shared Knowledge");
    expect(html).not.toContain("DATA &amp; INTELLIGENCE LAYER");
    expect(html).not.toContain("AI Insights");
    expect(html).not.toContain("AI LAYER");
    expect(html).not.toContain("hero-live-workspace.svg");
    expect(html).not.toContain("mkt-hero-stage");
  });

  it("renders why hotels need comparison section", () => {
    const html = renderToStaticMarkup(React.createElement(WhyHotelsNeedSection));

    expect(html).toContain('id="why-hotels-need"');
    expect(html).toContain("Why hotels need Monavel");
    expect(html).toContain("one operating system");
    expect(html).toContain("Without Monavel");
    expect(html).toContain("With Monavel");
    expect(html).toContain("Multiple systems");
    expect(html).toContain("One workspace");
    expect(html).toContain("mkt-why-need-grid");
    expect(html).toContain("mkt-action-card");
    expect(html).toContain("Monavel in Action");
    expect(html).toContain("Guest");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Knowledge + PMS");
    expect(html).toContain("Reply Delivered");
    expect(html).toContain("Reservation found");
    expect(html).toContain("PMS updated");
    expect(html).toContain("Guest notified");
    expect(html).not.toContain("Executive Dashboard");
  });

  it("renders who is monavel for section", () => {
    const html = renderToStaticMarkup(React.createElement(WhoIsMonavelForSection));

    expect(html).toContain('id="who-is-monavel-for"');
    expect(html).toContain("Boutique Hotels");
    expect(html).toContain("Hotel Chains");
    expect(html).toContain("Hostels");
  });

  it("renders operational scenario section", () => {
    const html = renderToStaticMarkup(
      React.createElement(OperationalScenarioSection)
    );

    expect(html).toContain('id="operational-scenario"');
    expect(html).toContain("early check-in");
    expect(html).toContain("Replies automatically");
    expect(html).toContain("mkt-scenario-flow");
  });

  it("renders business outcomes section", () => {
    const html = renderToStaticMarkup(React.createElement(BusinessOutcomesSection));

    expect(html).toContain('id="business-outcomes"');
    expect(html).toContain("Outcomes, not features");
    expect(html).toContain("Unify hotel operations");
  });

  it("renders how monavel works section", () => {
    const html = renderToStaticMarkup(React.createElement(HowMonavelWorksSection));

    expect(html).toContain('id="how-monavel-works"');
    expect(html).toContain("Connect PMS");
    expect(html).toContain("Go Live");
    expect(html).toContain("AI continuously improves");
    expect(html).toContain("mkt-how-works-timeline");
  });

  it("renders platform overview section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformOverviewSection)
    );

    expect(html).toContain('id="platform-overview"');
    expect(html).toContain("Platform overview");
    expect(html).toContain("Every channel. One connected system.");
    expect(html).toContain("/marketing/product/architecture/screenshot.svg");
    expect(html).toContain("app.monavel.com/integrations");
  });

  it("renders storytelling flow section", () => {
    const html = renderToStaticMarkup(React.createElement(StorytellingSection));

    expect(html).toContain('id="connected-intelligence"');
    expect(html).toContain("Guest");
    expect(html).toContain("Knowledge");
  });

  it("renders philosophy section", () => {
    const html = renderToStaticMarkup(React.createElement(PhilosophySection));

    expect(html).toContain('id="philosophy"');
    expect(html).toContain("Philosophy");
    expect(html).toContain("intelligent operating environment");
  });

  it("renders workspace showcase section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformShowcaseSection)
    );

    expect(html).toContain('id="product"');
    expect(html).toContain("See the product in action");
    expect(html).toContain("Eight workspaces — one environment");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Reception AI");
    expect(html).toContain('role="tablist"');
    expect(html).toContain("mkt-platform-showcase-nav");
    expect(html).not.toContain("mkt-workspace-switcher");
    expect(html).not.toContain("mkt-workspace-cards");
  });

  it("renders workspace preview with product screenshot", () => {
    const html = renderToStaticMarkup(React.createElement(WorkspacePreview));

    expect(html).toContain('data-workspace="bookings"');
    expect(html).toContain("mkt-browser-frame");
    expect(html).toContain("mkt-browser-shell");
    expect(html).toContain("app.monavel.com/bookings");
    expect(html).toContain("Monavel bookings");
    expect(html).toContain("/marketing/product/bookings/screenshot.svg");
  });

  it("renders platform pillars section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformPillarsSection)
    );

    expect(html).toContain('id="platform-pillars"');
    expect(html).toContain("One platform. Five layers.");
    expect(html).toContain("Run Operations");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Grow Revenue");
    expect(html).toContain('href="/#product"');
    expect(html).toContain('href="/ai"');
    expect(html).toContain('href="/pricing"');
    expect(html).toContain("Learn more");
  });

  it("renders ai experience section", () => {
    const html = renderToStaticMarkup(React.createElement(AIExperienceSection));

    expect(html).toContain('id="ai-experience"');
    expect(html).toContain("AI that understands context");
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
    expect(html).toContain("Simple pricing");
    expect(html).toContain("Built to grow with your hotel");
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
    expect(html).toContain("Why trust Monavel");
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

  it("renders homepage faq section", () => {
    const html = renderToStaticMarkup(React.createElement(HomepageFaqSection));

    expect(html).toContain('id="homepage-faq"');
    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain("Why Monavel instead of another PMS?");
    expect(html).toContain("Why not just use ChatGPT?");
    expect(html).toContain("Is my hotel data secure?");
    expect(html).toContain("mkt-homepage-faq-columns");
    expect(html).not.toContain("mkt-homepage-faq-closing");
  });

  it("renders final cta section", () => {
    const html = renderToStaticMarkup(React.createElement(FinalCtaSection));

    expect(html).toContain('id="final-cta"');
    expect(html).toContain("Why now");
    expect(html).toContain("Hotels already have the tools");
    expect(html).toContain("They need one operating system");
    expect(html).toContain("never work together");
    expect(html).toContain("mkt-final-cta-panel--triad");
    expect(html).toContain("mkt-final-cta-triad-card--statement");
    expect(html).toContain("Other software solves individual problems.");
    expect(html).not.toContain("mkt-final-cta-panel--why-now");
    expect(html).not.toContain("mkt-ecosystem-illustration");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Book a demo");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("AI Reception");
    expect(html).toContain("One Workspace");
    expect(html).toContain("Guest Communication");
    expect(html).toContain("Secure cloud platform");
  });

  it("renders blog coming soon page", () => {
    const html = renderToStaticMarkup(React.createElement(BlogComingSoonPage));

    expect(html).toContain("Insights for Modern Hotels");
    expect(html).toContain("Coming Soon");
    expect(html).toContain("Notify me");
    expect(html).toContain("you@hotel.com");
  });

  it("renders premium marketing footer", () => {
    const html = renderToStaticMarkup(React.createElement(MarketingFooter));

    expect(html).toContain("The AI Operating System for Modern Hotels.");
    expect(html).toContain("Product");
    expect(html).toContain("Resources");
    expect(html).toContain("Company");
    expect(html).toContain('href="/#product"');
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

    expect(html).toContain("Features");
    expect(html).toContain("How it works");
    expect(html).toContain("AI channels");
    expect(html).toContain("Pricing");
    expect(html).toContain("FAQ");
    expect(html).toContain("Telegram");
    expect(html).toContain("Analytics");
  });

  it("renders features page content", () => {
    const html = renderToStaticMarkup(React.createElement(FeaturesPage));

    expect(html).toContain("Everything your hotel needs.");
    expect(html).toContain("One connected platform.");
    expect(html).toContain("Five connected layers.");
    expect(html).toContain("Every workspace in Monavel.");
    expect(html).toContain("Website Chat");
    expect(html).toContain("Future integrations");
    expect(html).toContain("Planned");
    expect(html).toContain("Guest");
    expect(html).toContain("Workspace");
    expect(html).toContain("Less manual work");
    expect(html).toContain("Explore the full platform");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
  });

  it("renders ai marketing page content", () => {
    const html = renderToStaticMarkup(React.createElement(AiPage));

    expect(html).toContain("AI that understands your hotel.");
    expect(html).toContain("How AI works");
    expect(html).toContain("Monavel AI");
    expect(html).toContain("Knowledge + Reservation Context");
    expect(html).toContain("Guest Communication");
    expect(html).toContain("Reservation Assistance");
    expect(html).toContain("Contextual responses, not generic chat.");
    expect(html).toContain("Website Chat");
    expect(html).toContain("Planned");
    expect(html).toContain("AI handles routine. Staff handles exceptions.");
    expect(html).toContain("Escalation to staff");
    expect(html).toContain("Faster guest responses");
    expect(html).toContain("Put AI reception to work");
  });

  it("renders legacy features overview content", () => {
    const html = renderToStaticMarkup(React.createElement(FeaturesOverview));

    expect(html).toContain("Monavel features");
    expect(html).toContain("Book a demo");
    expect(html).toContain("mailto:hello@monavel.app");
  });

  it("renders pricing page content", () => {
    const html = renderToStaticMarkup(React.createElement(PricingPage));

    expect(html).toContain("Simple pricing for every hotel.");
    expect(html).toContain("Three plans. One platform.");
    expect(html).toContain("Most popular");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Contact sales");
    expect(html).toContain("Feature comparison.");
    expect(html).toContain("Knowledge Base");
    expect(html).toContain("Included");
    expect(html).toContain("Who is this plan for?");
    expect(html).toContain("Hotel groups and chains");
    expect(html).toContain("Can I cancel anytime?");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Contact us");
    expect(html).toContain("Choose a plan and start today");
  });

  it("renders pricing overview from billing plans", () => {
    const html = renderToStaticMarkup(React.createElement(PricingOverview));

    expect(html).toContain("Pricing");
    expect(html).toContain("Starter");
    expect(html).toContain("Pro");
    expect(html).toContain("Enterprise");
  });

  it("renders contact page content", () => {
    const html = renderToStaticMarkup(React.createElement(ContactPage));

    expect(html).toContain("talk about your hotel.");
    expect(html).toContain("Book a demo");
    expect(html).toContain("/demo");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("Sales");
    expect(html).toContain("Partnerships");
    expect(html).toContain("General inquiries");
    expect(html).toContain("sales@monavel.app");
    expect(html).toContain("hello@monavel.app");
    expect(html).toContain("Contact sales");
    expect(html).toContain("Number of rooms");
    expect(html).toContain("How quickly will you reply?");
    expect(html).toContain("Talk to the Monavel team");
  });

  it("renders security page content", () => {
    const html = renderToStaticMarkup(React.createElement(SecurityPage));

    expect(html).toContain("Security built into every workspace.");
    expect(html).toContain("Contact sales");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Tenant isolation");
    expect(html).toContain("Role-based access");
    expect(html).toContain("Monavel Platform");
    expect(html).toContain("Secure infrastructure");
    expect(html).toContain("Workspace isolation");
    expect(html).toContain("Encrypted connections");
    expect(html).toContain("Where is data stored?");
    expect(html).toContain("certifications");
    expect(html).toContain("Questions about platform security?");
  });

  it("renders integrations page content", () => {
    const html = renderToStaticMarkup(React.createElement(IntegrationsPage));

    expect(html).toContain("Connect every guest conversation.");
    expect(html).toContain("Website Chat");
    expect(html).toContain("Telegram");
    expect(html).toContain("Knowledge Base");
    expect(html).toContain("Available");
    expect(html).toContain("Planned");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Booking.com");
    expect(html).toContain("PMS integrations");
    expect(html).toContain("Hotel Team");
    expect(html).toContain("Unified conversations");
    expect(html).toContain("Connect your guest channels");
  });

  it("renders demo page content", () => {
    const html = renderToStaticMarkup(React.createElement(DemoPage));

    expect(html).toContain("See Monavel in action.");
    expect(html).toContain("Book a demo");
    expect(html).toContain("#demo-booking");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("Hotel Operations");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Book a time");
    expect(html).toContain("Discuss onboarding");
    expect(html).toContain("Independent hotels");
    expect(html).toContain("Hotel groups");
    expect(html).toContain("Growing properties");
    expect(html).toContain("Book demo");
    expect(html).toContain("Preferred date");
    expect(html).toContain("How long is the demo?");
    expect(html).toContain("What happens after the demo?");
    expect(html).toContain("See Monavel with your workflows");
  });

  it("renders about page content", () => {
    const html = renderToStaticMarkup(React.createElement(AboutPage));

    expect(html).toContain("Building the future operating system for hotels.");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("Less complexity for hotel teams.");
    expect(html).toContain("One intelligent workspace");
    expect(html).toContain("AI-first");
    expect(html).toContain("Simple by default");
    expect(html).toContain("Built for operators");
    expect(html).toContain("Continuous improvement");
    expect(html).toContain("One workspace");
    expect(html).toContain("One AI");
    expect(html).toContain("One source of truth");
    expect(html).toContain("Today");
    expect(html).toContain("AI-first PMS");
    expect(html).toContain("Hotel intelligence");
    expect(html).toContain("Future platform");
    expect(html).toContain("Build on one hotel workspace");
  });

  it("renders docs landing page content", () => {
    const html = renderToStaticMarkup(React.createElement(DocsLandingPage));

    expect(html).toContain("Documentation");
    expect(html).toContain("/docs/getting-started");
    expect(html).toContain("/docs/channels/telegram");
    expect(html).toContain("/docs/channels/website-chat");
    expect(html).toContain("/docs/knowledge-base");
    expect(html).toContain("/docs/billing");
    expect(html).toContain("Getting Started");
    expect(html).toContain("Start building on Monavel");
  });

  it("renders docs article page content", () => {
    const html = renderToStaticMarkup(
      React.createElement(DocsArticlePage, {
        article: {
          path: "/docs/getting-started",
          title: "Getting Started",
          description: "Trial setup path.",
          sections: [
            {
              id: "create-account",
              title: "Create account",
              body: "Sign up for Monavel.",
            },
          ],
          nextSteps: [
            {
              href: "/docs/channels/telegram",
              label: "Telegram",
              description: "Connect Telegram.",
            },
          ],
        },
      })
    );

    expect(html).toContain("Getting Started");
    expect(html).toContain("Create account");
    expect(html).toContain("Next steps");
    expect(html).toContain("/docs/channels/telegram");
    expect(html).toContain("Start building on Monavel");
  });

  it("renders privacy policy page content", () => {
    const html = renderToStaticMarkup(
      React.createElement(LegalPage, { document: PRIVACY_POLICY })
    );

    expect(html).toContain("Privacy Policy");
    expect(html).toContain("On this page");
    expect(html).toContain('href="#introduction"');
    expect(html).toContain("Information we collect");
    expect(html).toContain("User rights");
    expect(html).toContain("hello@monavel.app");
    expect(html).not.toContain("Hotels already have the tools");
  });

  it("renders terms of service page content", () => {
    const html = renderToStaticMarkup(
      React.createElement(LegalPage, { document: TERMS_OF_SERVICE })
    );

    expect(html).toContain("Terms of Service");
    expect(html).toContain('href="#acceptance"');
    expect(html).toContain("Acceptable use");
    expect(html).toContain("Limitation of liability");
    expect(html).toContain("hello@monavel.app");
    expect(html).not.toContain("Hotels already have the tools");
  });
});
