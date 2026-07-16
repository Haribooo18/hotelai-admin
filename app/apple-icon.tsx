import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

/** Apple touch icon — official Monavel mark. */
export default function AppleIcon() {
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
          borderRadius: 36,
        }}
      >
        <svg
          width="128"
          height="128"
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
