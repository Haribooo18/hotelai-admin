import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monavel Admin",
  description: "Monavel — AI Platform for Modern Hotels",
};

const shellThemeInitScript = `(function(){try{var k=${JSON.stringify(SHELL_THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==="light"||t==="gray"||t==="dark"){document.documentElement.dataset.shellTheme=t;}else{document.documentElement.dataset.shellTheme="dark";}}catch(e){document.documentElement.dataset.shellTheme="dark";}})();`;

const productReloadResetScript = buildProductReloadResetScript();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="shell-theme-init" strategy="beforeInteractive">
          {shellThemeInitScript}
        </Script>
        <Script id={PRODUCT_RELOAD_RESET_SCRIPT_ID} strategy="beforeInteractive">
          {productReloadResetScript}
        </Script>
      </head>
      <body
        className={`${geistSans.className} min-h-screen bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}