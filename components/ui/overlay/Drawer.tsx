"use client";

import * as React from "react";
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/core/Button";
import {
  drawerCloseButtonClass,
  drawerFooterClass,
  drawerFormContentClass,
  drawerHeaderClass,
  drawerSubtitleClass,
  drawerTitleClass,
  overlayBackdropClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

function Drawer(props: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerPortal(props: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(overlayBackdropClass, className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: DrawerPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        data-side={side}
        className={cn(drawerFormContentClass, className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DrawerClose
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              drawerCloseButtonClass
            )}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        ) : null}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(drawerHeaderClass, className)} {...props} />;
}

function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(drawerFooterClass, className)} {...props} />;
}

function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      className={cn(drawerTitleClass, className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      className={cn(drawerSubtitleClass, className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
