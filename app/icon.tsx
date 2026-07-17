import { ImageResponse } from "next/og";

export const size = {
  width: 16,
  height: 16,
};

export const contentType = "image/png";

/** Official Monavel mark — three architectural panels. */
export default function Icon() {
  // Same composition as the prior icon: mark at 90% of canvas, centered.
  // 48×48 → 16×16: mark 43.2 → 14.4, radius 10.5 → 3.5.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0F12",
          borderRadius: 3.5,
        }}
      >
        <svg
          width="14.4"
          height="14.4"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="5,6 12,10.5 12,26 5,21.5" fill="#C8A25A" />
          <polygon points="13.5,12.5 19,16 19,26 13.5,22.5" fill="#2B2F35" />
          <polygon points="20.5,10.5 27,6 27,21.5 20.5,26" fill="#1F5B4C" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
