"use client";

import { AppToaster } from "@/components/motion/AppToaster";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}