export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export type LegalDocument = {
  path: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export const LEGAL_CONTACT_EMAIL = "hello@monavel.app" as const;

export const PRIVACY_POLICY: LegalDocument = {
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How Monavel collects, uses, and stores information when hotels use the platform.",
  lastUpdated: "July 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "Monavel provides hotel operations software, including PMS workflows, AI reception, guest channels, and related administration tools.",
        "This Privacy Policy explains how Monavel handles information when hotels, their staff, and their guests interact with the platform.",
        "By using Monavel, you acknowledge that information may be processed as described in this policy.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      paragraphs: [
        "Monavel may collect information needed to operate the service, including:",
        "Account and workspace information such as names, email addresses, hotel details, and team membership.",
        "Operational data entered into the platform, including bookings, guests, rooms, calendar entries, and knowledge articles.",
        "Guest communication content sent through connected channels such as Website Chat and Telegram.",
        "Billing and subscription information associated with your Monavel account.",
        "Technical and usage information related to platform access, such as session activity and error logs needed to maintain the service.",
      ],
    },
    {
      id: "how-information-is-used",
      title: "How information is used",
      paragraphs: [
        "Monavel uses collected information to provide, maintain, and support the platform for your hotel workspace.",
        "Information may be used to operate AI reception, route guest conversations, manage hotel operations, process subscriptions, and respond to support requests.",
        "We may use aggregated or operational signals to improve reliability, security, and product functionality.",
        "Monavel does not sell hotel or guest data.",
      ],
    },
    {
      id: "data-storage",
      title: "Data storage",
      paragraphs: [
        "Hotel data is stored in cloud infrastructure scoped to your hotel workspace.",
        "Monavel uses tenant isolation so each hotel operates within its own workspace context.",
        "Access to stored information is limited to authenticated users with permissions for the relevant hotel workspace.",
        "Retention periods may vary by data type and operational need. Contact us if you have questions about data handling for your account.",
      ],
    },
    {
      id: "third-party-services",
      title: "Third-party services",
      paragraphs: [
        "Monavel relies on third-party providers to deliver parts of the platform.",
        "Payment processing is handled by Stripe for subscriptions and billing-related workflows.",
        "Infrastructure and database services support hosting, storage, and platform operations.",
        "Guest channels such as Telegram are operated through their respective providers and connected to Monavel through configured integrations.",
        "Third-party providers process information according to their own terms and policies, in addition to the controls described here.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "Monavel uses cookies and similar technologies needed for authentication, session management, and secure access to the platform.",
        "These technologies help keep you signed in and protect access to your hotel workspace.",
        "You can control cookie behavior through your browser settings, but disabling required cookies may affect your ability to use the platform.",
      ],
    },
    {
      id: "user-rights",
      title: "User rights",
      paragraphs: [
        "Depending on your location and relationship to Monavel, you may have rights to access, correct, or request deletion of certain information associated with your account.",
        "Hotel administrators can manage team access and much of the operational data within their workspace.",
        "To make a privacy-related request, contact us using the details in the Contact section below. We will review requests in line with applicable requirements.",
        "This policy does not constitute a statement of regulatory certification or compliance with any specific legal framework.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "For privacy questions or requests related to Monavel, contact:",
        `Email: ${LEGAL_CONTACT_EMAIL}`,
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  path: "/terms",
  title: "Terms of Service",
  description:
    "Terms governing access to and use of the Monavel hotel operations platform.",
  lastUpdated: "July 2026",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance",
      paragraphs: [
        "These Terms of Service govern access to and use of Monavel.",
        "By creating an account, starting a trial, subscribing, or otherwise using the platform, you agree to these terms on behalf of yourself and, where applicable, the hotel or organization you represent.",
        "If you do not agree, do not use Monavel.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts",
      paragraphs: [
        "You are responsible for maintaining the confidentiality of account credentials and for activity under your account.",
        "You must provide accurate account and hotel information and keep it current.",
        "Hotel administrators are responsible for managing team access and permissions within their workspace.",
        "Monavel may suspend or restrict access if we reasonably believe an account has been compromised or is being misused.",
      ],
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      paragraphs: [
        "Monavel offers subscription plans with different workspace and feature limits.",
        "Trials may be available for certain plans. Trial terms, duration, and eligibility are presented during signup or in billing settings.",
        "Subscriptions renew according to the billing cycle selected unless cancelled through billing settings or as otherwise described at checkout.",
        "Plan changes may take effect on the next billing cycle unless stated otherwise during the change process.",
      ],
    },
    {
      id: "payments",
      title: "Payments",
      paragraphs: [
        "Paid subscriptions are processed through Stripe or other payment providers made available in the platform.",
        "You authorize charges for the plan, billing period, and taxes or fees disclosed at checkout.",
        "Failure to pay may result in suspension or termination of access to paid features.",
        "Billing history and invoice access are provided through Monavel billing settings where available.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: [
        "You agree to use Monavel only for lawful hotel operations and related business purposes.",
        "You may not attempt to access another hotel's workspace, interfere with platform security, abuse guest channels, or use the service to distribute unlawful, harmful, or deceptive content.",
        "You are responsible for guest-facing communications sent through your connected channels and for ensuring your team's use of the platform complies with applicable law.",
        "Monavel may investigate and take action against use that violates these terms or creates risk for the platform or other customers.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "Monavel and its licensors retain all rights in the platform, software, branding, and related materials.",
        "These terms do not transfer ownership of Monavel intellectual property to you.",
        "You retain ownership of the hotel data and content you submit to the platform, subject to the rights needed for Monavel to host and operate the service.",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      paragraphs: [
        "You may stop using Monavel at any time and may cancel subscriptions through billing settings, subject to the terms of your current billing period.",
        "Monavel may suspend or terminate access if you materially breach these terms, fail to pay applicable fees, or create security or operational risk.",
        "Upon termination, access to the platform may end. Provisions that by their nature should survive termination will continue to apply.",
      ],
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      paragraphs: [
        "Monavel is provided on an \"as is\" and \"as available\" basis to the extent permitted by applicable law.",
        "We do not guarantee uninterrupted operation, error-free performance, or that AI-generated responses will always be accurate or complete.",
        "Hotels remain responsible for operational decisions, guest communications, and compliance with laws applicable to their business.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      paragraphs: [
        "To the extent permitted by applicable law, Monavel and its suppliers will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or business opportunities arising from use of the platform.",
        "Monavel's total liability for claims arising out of or related to the service will be limited to the amount paid by you to Monavel for the service during the twelve months preceding the event giving rise to the claim, unless a different limit is required by applicable law.",
        "Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "For questions about these Terms of Service, contact:",
        `Email: ${LEGAL_CONTACT_EMAIL}`,
      ],
    },
  ],
};
