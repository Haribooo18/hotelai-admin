"use client";

import Script from "next/script";

declare global {
  interface Window {
    HotelAI?: {
      init: (config: {
        hotelId: string;
        apiUrl: string;
        theme?: "light" | "dark";
        position?: "left" | "right";
        primaryColor?: string;
        guestName?: string;
      }) => void;
    };
  }
}

const HOTEL_ID = process.env.NEXT_PUBLIC_DEMO_HOTEL_ID;

export function WebsiteChatWidget() {
  if (!HOTEL_ID) {
    return null;
  }

  return (
    <Script
      src="/widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.HotelAI?.init({
          hotelId: HOTEL_ID,
          apiUrl: window.location.origin,
          theme: "dark",
          position: "right",
          primaryColor: "#10b981",
          guestName: "Website Guest",
        });
      }}
    />
  );
}