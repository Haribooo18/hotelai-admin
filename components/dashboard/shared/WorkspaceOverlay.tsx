"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlay/Drawer";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { motionPresets } from "@/lib/design/motion";
import {
  drawerFooterActionsClass,
  drawerFooterClass,
  drawerFormBodyClass,
  drawerInspectorBodyClass,
  drawerInspectorContentClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type WorkspaceFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function WorkspaceFormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: WorkspaceFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>

        <div className={drawerFormBodyClass}>{children}</div>

        {footer ? <div className={drawerFooterClass}>{footer}</div> : null}
      </DrawerContent>
    </Drawer>
  );
}

type WorkspaceInspectorDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  tabs?: ReactNode;
};

export function WorkspaceInspectorDrawer({
  open,
  onOpenChange,
  header,
  children,
  footer,
  tabs,
}: WorkspaceInspectorDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={drawerInspectorContentClass}>
        <div className={motionPresets.inspectorRevealRoot}>
          <MotionReveal order={0}>
            <DrawerHeader>{header}</DrawerHeader>
          </MotionReveal>

          {tabs ? <MotionReveal order={1}>{tabs}</MotionReveal> : null}

          <MotionReveal order={tabs ? 2 : 1}>
            <Scrollable className={drawerInspectorBodyClass}>{children}</Scrollable>
          </MotionReveal>

          {footer ? (
            <MotionReveal order={tabs ? 3 : 2}>
              <div className={drawerFooterClass}>{footer}</div>
            </MotionReveal>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type WorkspaceOverlayActionsProps = {
  children: ReactNode;
  className?: string;
};

export function WorkspaceOverlayActions({
  children,
  className,
}: WorkspaceOverlayActionsProps) {
  return (
    <div className={cn(drawerFooterActionsClass, className)}>{children}</div>
  );
}
