"use client";

import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={5000}
      />
    </>
  );
}