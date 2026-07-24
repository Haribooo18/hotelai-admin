import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

/**
 * Official Monavel mark — three architectural panels.
 *
 * Previously rendered at 16×16, which left almost no pixel data for the
 * mark's diagonal edges to anti-alias against — on any high-DPI (Retina)
 * display the browser tab upscaled that 16px source, producing a visibly
 * pixelated/blurry icon. Doubled to 32×32 (4x the pixel area), which is
 * also the resolution most browsers actually request for tab favicons on
 * modern displays, so this is no longer being upscaled from an
 * undersized source.
 */
export default function Icon() {
  // Mark at 90% of canvas, centered, same proportions as before.
  // 32×32 canvas -> mark 28.8, radius 7.
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
          borderRadius: 7,
        }}
      >
        <svg
          width="28.8"
          height="28.8"
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
