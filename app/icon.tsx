import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="7" fill="#3d9b80" />
          <rect x="7.5" y="10" width="5.5" height="12" rx="1.5" fill="#f8faf9" />
          <rect x="19" y="10" width="5.5" height="12" rx="1.5" fill="#f8faf9" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
