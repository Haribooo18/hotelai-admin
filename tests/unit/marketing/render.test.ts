import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  AIChannelsSection,
  FAQSection,
  FeaturesOverview,
  FeaturesPage,
  AiPage,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  HowMonavelWorksSection,
  WhyHotelsNeedSection,
  WhoIsMonavelForSection,
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
  MarketingHeader,
  HomepageScrollReset,
  WorkspacePreview,
} from "@/components/marketing";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/lib/marketing/legal";
import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

describe("marketing page rendering", () => {
  it("renders landing hero with concept illustration", () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection));

    expect(html).toContain("Everything your hotel needs.");
    expect(html).toContain("One operating system.");
    expect(html).toContain("mkt-overline");
    expect(html).toContain("AI Operating System for Hotels");
    expect(html).toContain(
      "Run reservations, guest communication, hotel operations, and AI reception from one connected workspace."
    );
    expect(html).toContain("Unified Workspace");
    expect(html).toContain("Launch in Days");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Book a demo");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("mkt-architecture-diagram-v2");
    expect(html).toContain("MONAVEL");
    expect(html).toContain("AI Operating System");
    expect(html).toContain("GUEST CHANNELS");
    expect(html).toContain("HOTEL OPERATIONS");
    expect(html).toContain("Website");
    expect(html).toContain("Booking.com");
    expect(html).toContain("Telegram");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Email");
    expect(html).toContain("Phone");
    expect(html).toContain("Walk-in");
    expect(html).toContain("AI Reception");
    expect(html).toContain("PMS");
    expect(html).toContain("Revenue");
    expect(html).toContain("Rooms");
    expect(html).toContain("Staff");
    expect(html).toContain("Analytics");
    expect(html).toContain("Integrations");
    expect(html).toContain("data-runtime-phase");
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

  it("renders why hotels need problem section as a visual product story", () => {
    const html = renderToStaticMarkup(React.createElement(WhyHotelsNeedSection));

    expect(html).toContain('id="why-hotels-need"');
    expect(html).not.toContain("THE PROBLEM");
    expect(html).toContain("One Runtime");
    expect(html).toContain("Every hotel system");
    expect(html).not.toContain("speaks a different language");
    expect(html).toContain("Every update becomes shared operational context.");
    expect(html).not.toContain("Monavel connects everything automatically.");
    expect(html).toContain("Communication");
    expect(html).toContain("Operations");
    expect(html).toContain("Hotel Data");
    expect(html).toContain("Revenue");
    expect(html).toContain("mkt-why-need-problems");
    expect(html).toContain("mkt-why-need-problem");
    expect(html).toContain("mkt-why-need-card");
    expect(html).not.toContain("mkt-why-need-illustration");
    // shared identity layer — same guest / reservation / room on every card
    expect(html).toContain("mkt-why-need-identity");
    expect(html).toContain("#48291");
    expect(html).toContain("Room 407");
    // communication: channels flow into an inbox, an AI hub, and one guest profile
    expect(html).toContain("mkt-why-need-channels");
    expect(html).toContain("mkt-why-need-inbox");
    expect(html).toContain("mkt-why-need-inbox-row");
    expect(html).toContain("mkt-why-need-node--hub");
    expect(html).toContain("mkt-why-need-guest-panel");
    expect(html).toContain("mkt-why-need-guest-chip");
    expect(html).toContain("mkt-why-need-guest-avatar");
    // operations: vertical workflow with completed/current states, an assignee and room summary
    expect(html).toContain("mkt-why-need-ops-track");
    expect(html).toContain('data-state="completed"');
    expect(html).toContain('data-state="current"');
    expect(html).toContain('data-state="upcoming"');
    expect(html).toContain("mkt-why-need-ops-avatar");
    expect(html).toContain("mkt-why-need-room-panel");
    // hotel data: source modules syncing into a live database, powering a mini dashboard
    expect(html).toContain("mkt-why-need-sources");
    expect(html).toContain("mkt-why-need-source");
    expect(html).toContain("mkt-why-need-dashboard");
    expect(html).toContain("mkt-why-need-metric");
    expect(html).toContain("mkt-why-need-metric-value");
    expect(html).toContain("mkt-why-need-activity");
    expect(html).toContain("Recent Sync Activity");
    expect(html).toContain("Guest profile updated");
    expect(html).toContain("mkt-why-need-data-connector");
    // revenue: occupancy/ADR KPIs feeding an AI recommendation panel and a real SVG chart
    expect(html).toContain("mkt-why-need-rev-kpi");
    expect(html).toContain("mkt-why-need-ai-panel");
    expect(html).toContain("mkt-why-need-ai-badge");
    expect(html).toContain("mkt-why-need-price-new");
    expect(html).toContain("mkt-why-need-chart-svg");
    expect(html).toContain("mkt-why-need-chart-frame");
    expect(html).toContain("mkt-why-need-comm-bridge");
    expect(html).toContain("mkt-why-need-comm-flow-gap");
    expect(html).toContain("mkt-why-need-sync-bridge");
    expect(html).toContain("mkt-why-need-impact-panel");
    expect(html).toContain("mkt-why-need-action-row");
    expect(html).toContain("mkt-why-need-body--story");
    expect(html).toContain("Request invoice");
    expect(html).toContain("Invoice");
    expect(html).toContain("Understanding guest context");
    expect(html).not.toContain("Processing request");
    // synchronized invoice story across all four panels (SSR / reduced-motion baseline)
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Booking.com");
    expect(html).toContain("Telegram");
    expect(html).toContain("Email");
    expect(html).toContain("Monavel AI");
    expect(html).toContain("Maria Thompson");
    expect(html).toContain("Late check-in");
    expect(html).toContain(">VIP<");
    expect(html).toContain("Housekeeping assigned");
    expect(html).toContain("Guest checked in");
    expect(html).toContain("Live Hotel Database");
    expect(html).toContain("PMS");
    expect(html).toContain("CRM");
    expect(html).toContain("Rooms");
    expect(html).toContain("Reservations");
    expect(html).toContain("Current ADR");
    expect(html).toContain("AI Pricing Recommendation");
    expect(html).toContain("$118");
    expect(html).toContain("$134");
    expect(html).toContain("Billing request logged");
    expect(html).toContain("+$0 hold");
    expect(html).toContain("Projected Revenue Impact");
    expect(html).toContain("Reservation #48291");
    expect(html).toContain("Reservation #48291 synced");
    expect(html).toContain("Room 407 synced");
    expect(html).not.toContain("Room inspected");
    expect(html).not.toContain("98%");
    expect(html).not.toContain("Understanding guest intent");
    expect(html).not.toContain("Parking requested");
    expect(html).not.toContain("Occupancy");
    expect(html).toContain('data-story-phase="synchronized"');
    expect(html).toContain('data-card-role="synced"');
    expect(html).toContain('data-still="true"');
    // panels are accessible as concise labelled regions, not paragraphs of text
    expect(html).toContain('role="img"');
    // no long paragraph explanations or the old comparison legend — the product is shown instead
    expect(html).not.toContain("Disconnected today");
    expect(html).not.toContain("With Monavel");
    expect(html).not.toContain("Today:");
    expect(html).not.toContain("Channels operate separately");
    expect(html).not.toContain("Guest conversations are fragmented");
    expect(html).not.toContain("Hotel data is disconnected");
    expect(html).not.toContain("mkt-action-card");
    expect(html).not.toContain("Monavel in Action");
    expect(html).not.toContain("Executive Dashboard");
    expect(html).not.toContain("mkt-why-need-body--live");
    expect(html).not.toContain("mkt-why-need-connector-rail");
  });

  it("renders who is monavel for section", () => {
    const html = renderToStaticMarkup(React.createElement(WhoIsMonavelForSection));

    expect(html).toContain('id="who-is-monavel-for"');
    expect(html).toContain("Boutique Hotels");
    expect(html).toContain("Hotel Chains");
    expect(html).toContain("Hostels");
  });

  it("renders how monavel works section", () => {
    const html = renderToStaticMarkup(React.createElement(HowMonavelWorksSection));

    expect(html).toContain('id="how-monavel-works"');
    expect(html).toContain("One request");
    expect(html).toContain("Entire hotel ready");
    expect(html).toContain("Maria Thompson");
    expect(html).toContain("Request invoice");
    expect(html).toContain("Monavel AI");
    expect(html).toContain("mkt-operate-ai");
    expect(html).toContain('data-ai-state="understanding"');
    expect(html).toContain('data-ai-state="decision"');
    expect(html).toContain('data-ai-state="execution"');
    expect(html).toContain('data-ai-state="completed"');
    expect(html).toContain("PMS");
    expect(html).toContain("Housekeeping");
    expect(html).toContain("Parking");
    expect(html).toContain("Front Desk");
    expect(html).toContain("CRM");
    expect(html).toContain("Revenue");
    expect(html).toContain("Guest context synced");
    expect(html).toContain("Everything ready for arrival");
    expect(html).toContain("Updated");
    expect(html).toContain("Aware");
    expect(html).toContain("Arrival confirmed");
    expect(html).toContain("Late arrival noted.");
    expect(html).toContain("Parking booked.");
    expect(html).toContain("Invoice ready at check-in.");
    expect(html).toContain("One guest request. The Runtime builds one operational understanding.");
    expect(html).toContain(
      "Built from live reservations, hotel operations, business rules, and connected systems."
    );
    expect(html).toContain("Understanding guest context");
    expect(html).toContain("Building one operational understanding");
    expect(html).toContain("One operational understanding established");
    expect(html).toContain("Guest Context");
    expect(html).toContain("Late arrival");
    expect(html).toContain("Hotel systems synced");
    expect(html).toContain("Hotel systems syncing");
    expect(html).toContain(">Live<");
    expect(html).toContain("mkt-operate-ai-console");
    expect(html).toContain("mkt-operate-scene");
    expect(html).toContain("data-phase");
    expect(html).toContain("mkt-operate-reply-subject");
    expect(html).not.toContain("Operation Plan");
    expect(html).not.toContain("Update PMS");
    expect(html).not.toContain("Coordinating connected systems");
    expect(html).not.toContain("mkt-how-works-timeline");
    expect(html).not.toContain("Analyzing reservation");
  });

  it("renders platform overview section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformOverviewSection)
    );

    expect(html).toContain('id="platform-overview"');
    expect(html).toContain("Platform overview");
    expect(html).toContain("Every channel. One connected system.");
    expect(html).toContain("/marketing/product/architecture/screenshot.svg");
    expect(html).toContain("monavel.app/integrations");
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
    expect(html).toContain("operating environment");
  });

  it("renders product showcase as one Runtime with operational perspectives", () => {
    const html = renderToStaticMarkup(
      React.createElement(PlatformShowcaseSection)
    );
  
    expect(html).toContain('id="product"');
    expect(html).toContain("One Runtime.");
    expect(html).toContain("Every operational perspective.");
    expect(html).toContain(
      "Every perspective reflects the same live hotel in real time."
    );
    expect(html).toContain("Online");
  
    expect(html).toContain("Operations Perspective");
    expect(html).toContain("Revenue Perspective");
    expect(html).toContain("Knowledge Perspective");
    expect(html).toContain("Automation Perspective");
    expect(html).not.toContain("Guest Perspective");
  
    expect(html).toContain("Monavel Grand • Live");
    expect(html).toContain("Maria Thompson");
    expect(html).toContain("Reservation #48291");
    expect(html).toContain("Deluxe 407");
    expect(html).toContain("One living hotel.");
    expect(html).toContain("Different perspectives.");
  
    expect(html).toContain("mkt-runtime-identity");
    expect(html).toContain('role="tablist"');
    expect(html).toContain("mkt-perspective-nav");
    expect(html).toContain("mkt-platform-showcase-shell");
  
    expect(html).not.toContain("mkt-runtime-toolbar");
    expect(html).not.toContain("Eight connected workspaces");
    expect(html).not.toContain("See the product in action");
    expect(html).not.toContain("mkt-workspace-switcher");
    expect(html).not.toContain("mkt-workspace-cards");
  });

  it("renders workspace preview with runtime component", () => {
    const html = renderToStaticMarkup(
      React.createElement(WorkspacePreview)
    );
  
    expect(html).toContain('data-workspace="dashboard"');
    expect(html).toContain("mkt-browser-frame");
    expect(html).toContain("mkt-browser-shell");
    expect(html).toContain("monavel.app/dashboard");
    expect(html).toContain("Monavel Dashboard");
    expect(html).toContain("mkt-browser-favicon");
    expect(html).toContain('viewBox="0 0 16 16"');
    expect(html).toContain("#C8A25A");
    expect(html).not.toContain("/brand/monavel-mark.svg");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Maria Thompson");
    expect(html).not.toContain("vercel.svg");
    expect(html).not.toContain("app.monavel.com");
  
    expect(html).not.toContain(
      "/marketing/product/bookings/screenshot.svg"
    );
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

  it("renders pricing preview section", () => {
    const html = renderToStaticMarkup(
      React.createElement(PricingPreviewSection)
    );

    expect(html).toContain('id="pricing-preview"');
    expect(html).toContain("Start with one hotel.");
    expect(html).toContain("Grow without changing platforms.");
    expect(html).toContain("same Monavel Runtime");
    expect(html).toContain("The Runtime never changes.");
    expect(html).toContain("Only your operational scale does.");
    expect(html).toContain("Independent Hotel");
    expect(html).toContain("Growing Hotel");
    expect(html).toContain("Hotel Groups");
    expect(html).toContain("For one property.");
    expect(html).toContain("Deployment");
    expect(html).toContain("Works with your PMS");
    expect(html).toContain("Migration included");
    expect(html).toContain("No rip-and-replace");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Book a demo");
    expect(html).toContain("Contact sales");
    expect(html).toContain('href="/demo"');
    expect(html).toContain('href="/pricing"');
    expect(html).toContain("View full details");
    expect(html).toContain("How do I know which deployment fits?");
    expect(html).not.toContain("Most popular");
    expect(html).not.toContain("€49");
    expect(html).not.toContain("Choose your scale");
    expect(html).not.toContain(">Implementation<");
  });

  it("renders trust section", () => {
    const html = renderToStaticMarkup(React.createElement(TrustSection));

    expect(html).toContain('id="trust"');
    expect(html).toContain("Built to run a real hotel");
    expect(html).toContain("Existing PMS compatibility");
    expect(html).toContain("Human approval and override");
    expect(html).toContain("Secure hotel data");
    expect(html).toContain("Fast deployment");
    expect(html).toContain("Workflow reliability");
    expect(html).toContain("Complete audit trail");
    expect(html).toContain("Runtime Guarantees");
    expect(html).toContain("One Runtime");
    expect(html).toContain("Live sync");
    expect(html).toContain("Human oversight");
    expect(html).toContain("Encrypted communication");
    expect(html).toContain("Connected systems");
    expect(html).toContain('href="/security"');
    expect(html).toContain("Security details");
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
    expect(html).toContain("Your hotel already has software.");
    expect(html).toContain("Now give it one Runtime.");
    expect(html).toContain("Launch in days.");
    expect(html).toContain("Works with your existing PMS.");
    expect(html).toContain("Guided onboarding from day one.");
    expect(html).toContain("mkt-final-cta-section--closing");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Book a demo");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).not.toContain("mkt-final-cta-panel--triad");
    expect(html).not.toContain("Why now");
    expect(html).not.toContain("AI Reception");
    expect(html).not.toContain("Secure cloud platform");
  });

  it("renders premium marketing footer", () => {
    const html = renderToStaticMarkup(React.createElement(MarketingFooter));

    expect(html).toContain("Platform");
    expect(html).toContain("Resources");
    expect(html).toContain("Company");
    expect(html).toContain("Legal");
    expect(html).toContain("Runtime");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Documentation");
    expect(html).toContain('href="/#product"');
    expect(html).toContain('href="/integrations"');
    expect(html).toContain('href="/docs"');
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
    expect(html).toContain("© Monavel — AI Operating System for Hotels");
    expect(html).not.toContain("Built for modern hotels.");
    expect(html).not.toContain("All rights reserved");
    expect(html).not.toContain("/#product#product");
    expect(html).not.toMatch(/#product[^"]*#product/);
  });

  it("renders header desktop and mobile nav with the same canonical Product destination", () => {
    const html = renderToStaticMarkup(React.createElement(MarketingHeader));

    expect(html).toContain(`href="${MARKETING_PRODUCT_HREF}"`);
    expect(html).toContain('href="/ai"');
    expect(html).not.toContain('href="/app/ai"');
    expect(html).not.toContain("/#product#product");
    expect(html).not.toMatch(/#product[^"]*#product/);

    const productHrefOccurrences = html.split(`href="${MARKETING_PRODUCT_HREF}"`).length - 1;
    // Desktop nav renders the item once; the mobile nav panel only exists
    // once opened, so the static markup only contains the desktop instance.
    expect(productHrefOccurrences).toBeGreaterThanOrEqual(1);
  });

  it("renders the homepage scroll-reset helper without visible markup", () => {
    const html = renderToStaticMarkup(React.createElement(HomepageScrollReset));

    expect(html).toBe("");
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

    expect(html).toContain("Your hotel never sleeps.");
    expect(html).toContain("Monavel AI");
    expect(html).toContain("Any chance of a room upgrade?");
    expect(html).toContain("Upgrade confirmed.");
    expect(html).toContain("8 sec");
    expect(html).toContain("Reservation confirmed");
    expect(html).toContain("Overnight, nothing is missed.");
    expect(html).toContain("Spa");
    expect(html).toContain("Wake-up call");
    expect(html).toContain("Missed");
    expect(html).toContain("Every second matters.");
    expect(html).toContain("Slow replies lose bookings.");
    expect(html).toContain("Opens another channel");
    expect(html).toContain("Reservation lost");
    expect(html).toContain("Guest lost");
    expect(html).toContain("Guest retained");
    expect(html).toContain("Late check-in approved");
    expect(html).toContain("AI replies");
    expect(html).toContain("45 min");
    expect(html).toContain("−$186");
    expect(html).toContain("+$186");
    expect(html).toContain("Every request handled.");
    expect(html).toContain("Airport transfer");
    expect(html).toContain("Booked");
    expect(html).toContain("Knowledge Base");
    expect(html).toContain("Booking.com");
    expect(html).not.toContain("Receiving inquiries");
    expect(html).not.toContain("AI answering guests");
    expect(html).toContain("Everything stays connected.");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Start today.");
    expect(html).toContain("Protect every booking from the first message.");
    expect(html).toContain("Start free trial");
    expect(html).not.toContain("Book Demo");
  });

  it("renders legacy features overview content", () => {
    const html = renderToStaticMarkup(React.createElement(FeaturesOverview));

    expect(html).toContain("Monavel features");
    expect(html).toContain("Book a demo");
    expect(html).toContain("mailto:hello@monavel.app");
  });

  it("renders pricing page content", () => {
    const html = renderToStaticMarkup(React.createElement(PricingPage));

    expect(html).toContain("Pricing");
    expect(html).toContain("One Runtime. Three plans.");
    expect(html).not.toContain("Upgrade whenever your hotel grows.");
    expect(html).not.toContain("Start free on Starter or Pro.");
    expect(html).not.toContain("Choose a plan");
    expect(html).toContain("Starter");
    expect(html).toContain("Pro");
    expect(html).toContain("Enterprise");
    expect(html).toContain("Most popular");
    expect(html).toContain("€49");
    expect(html).toContain("€149");
    expect(html).toContain("Compare plans");
    expect(html).toContain("Platform");
    expect(html).toContain(">AI<");
    expect(html).toContain("Operations");
    expect(html).toContain("Support");
    expect(html).toContain("Pricing FAQ");
    expect(html).toContain("Is there a free trial?");
    expect(html).toContain("Start free trial");
    expect(html).toContain("Contact sales");
    expect(html).toContain("mkt-pricing-details");
    expect(html).toContain("mkt-pricing-details-faq");
    expect(html).not.toContain("mkt-pricing-hero-actions");
    expect(html).not.toContain("Ready to get started?");
    expect(html).not.toContain("Start free today or schedule a short demo.");
    expect(html).not.toContain("Find the right fit");
    expect(html).not.toContain("final-cta");
    expect(html).not.toContain("mkt-final-cta");
    // CTAs only on plan cards — no trailing CTA after FAQ.
    expect(html.indexOf("mkt-pricing-plans")).toBeLessThan(
      html.indexOf("Start free trial")
    );
    expect(html.indexOf("mkt-pricing-details-faq")).toBeGreaterThan(
      html.lastIndexOf("Book a demo")
    );
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
    expect(html).toContain("Recommended");
    expect(html).toContain("Partnerships");
    expect(html).toContain("General inquiries");
    expect(html).toContain("sales@monavel.app");
    expect(html).toContain("hello@monavel.app");
    expect(html).toContain("Contact sales");
    expect(html).toContain("Number of rooms");
    expect(html).toContain("What would you like to improve?");
    expect(html).toContain("How quickly will you reply?");
    expect(html).not.toContain("Talk to the Monavel team");
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
    expect(html).toContain("Integrations");
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

    expect(html).toContain("See how Monavel would run your hotel.");
    expect(html).toContain("Book a demo");
    expect(html).toContain("#demo-booking");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("Operations");
    expect(html).toContain("AI Reception");
    expect(html).toContain("Revenue");
    expect(html).toContain("Hotel size");
    expect(html).toContain("What should we focus on?");
    expect(html).toContain("How long is the demo?");
    expect(html).toContain("Is it personalized?");
    expect(html).toContain("Can my team join?");
    expect(html).toContain("What happens after the demo?");

    expect(html).not.toContain("Preferred date");
    expect(html).not.toContain("Book a time");
    expect(html).not.toContain("Discuss onboarding");
    expect(html).not.toContain("Independent hotels");
    expect(html).not.toContain("Hotel groups");
    expect(html).not.toContain("Growing properties");
    expect(html).not.toContain("Ready to explore your hotel inside Monavel?");
  });

  it("renders about page content", () => {
    const html = renderToStaticMarkup(React.createElement(AboutPage));

    // Guards against marking unrelated hero screenshots as priority —
    // only the Docs landing hero should preload its image.
    expect(html).not.toContain('<link rel="preload" as="image"');
    expect(html).toContain("Building the future operating system for hotels.");
    expect(html).toContain("/login?intent=trial");
    expect(html).toContain("/demo");
    expect(html).toContain("Less complexity for hotel teams.");
    expect(html).toContain("One workspace");
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
    expect(html).toContain(
      "Everything you need to deploy, configure and operate Monavel."
    );
    expect(html).toContain("Search documentation...");
    expect(html).toContain("Install Monavel");
    expect(html).toContain("Runtime");
    expect(html).toContain("Shared operating layer for every workspace.");
    expect(html).toContain("Telegram");
    expect(html).toContain("Administration");
    expect(html).toContain("Roles &amp; Permissions");
    expect(html).toContain("Authentication");
    expect(html).toContain("Connect Telegram");
    expect(html).toContain("Need help?");
    expect(html).toContain("Community");
    expect(html).toContain("/docs/getting-started");
    expect(html).toContain("/docs/channels/telegram");
    expect(html).toContain("/docs/channels/website-chat");
    expect(html).toContain("/docs/knowledge-base");
    expect(html).toContain("/docs/billing");
    expect(html).not.toContain("Start building on Monavel");
    expect(html).not.toContain("Start free trial");
    expect(html).not.toContain("mkt-docs-sidebar");
  });

  it("keeps docs landing free of marketing hero media", () => {
    const html = renderToStaticMarkup(React.createElement(DocsLandingPage));

    expect(html).not.toContain(
      '<link rel="preload" as="image" href="/marketing/product/knowledge/screenshot.svg"/>'
    );
    expect(html).not.toContain("mkt-page-hero");
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
    expect(html).toContain("On this page");
    expect(html).toContain('href="#create-account"');
    expect(html).toContain("mkt-docs-sidebar");
    expect(html).toContain("Search documentation...");
    expect(html).not.toContain("Start building on Monavel");
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
