"use client";

import type { ReactNode } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { focusRingClassName } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

function Tabs(props: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({
  className,
  ...props
}: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[var(--shell-muted)] transition-[background-color,color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:text-[var(--shell-text)] data-selected:bg-[var(--shell-nav-active-bg)] data-selected:text-[var(--shell-accent)] data-selected:shadow-[var(--shell-shadow-sm)]",
        focusRingClassName,
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("mt-4 outline-none", className)}
      {...props}
    />
  );
}

type SimpleTabsProps = {
  value: string;
  onChange: (value: string) => void;
  items: Array<{ value: string; label: ReactNode; content: ReactNode }>;
  className?: string;
};

function SimpleTabs({ value, onChange, items, className }: SimpleTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className={className}>
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, SimpleTabs };
