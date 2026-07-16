import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
} from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { Providers } from "./providers";
import { SHELL_THEME_STORAGE_KEY } from "@/lib/dashboard/shell-theme";
import {
  PRODUCT_RELOAD_RESET_SCRIPT_ID,
  buildProductReloadResetScript,
} from "@/lib/marketing/product-reload-reset";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-monavel-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://monavel.app"),
  title: {
    default: "Monavel — AI Receptionist for Hotels",
    template: "%s — Monavel",
  },
  description:
    "Monavel — AI operating system for modern hotels.",
};

const shellThemeInitScript = `(function(){try{var k=${JSON.stringify(
  SHELL_THEME_STORAGE_KEY
)};var t=localStorage.getItem(k);if(t==="light"||t==="gray"||t==="dark"){document.documentElement.dataset.shellTheme=t;}else{document.documentElement.dataset.shellTheme="dark";}}catch(e){document.documentElement.dataset.shellTheme="dark";}})();`;

const productReloadResetScript = buildProductReloadResetScript();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
        cormorantDisplay.variable,
        "h-full antialiased",
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
      <Script
  id="shell-theme-init"
  strategy="beforeInteractive"
  dangerouslySetInnerHTML={{
    __html: shellThemeInitScript,
  }}
/>

        <Script
          id={PRODUCT_RELOAD_RESET_SCRIPT_ID}
          strategy="beforeInteractive"
        >
          {productReloadResetScript}
        </Script>
      </head>

      <body className="min-h-screen bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}