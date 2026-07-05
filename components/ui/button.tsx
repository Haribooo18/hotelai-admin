import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] border border-transparent bg-clip-padding text-[13px] font-medium whitespace-nowrap outline-none select-none transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[loading=true]:text-transparent",
  {
    variants: {
      variant: {
        default:
          "border-[var(--shell-accent-border)] bg-[linear-gradient(180deg,var(--shell-accent-hover)_0%,var(--shell-accent)_100%)] text-white shadow-[var(--shell-shadow-accent)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-md)] active:translate-y-0",
        outline:
          "border-[var(--shell-border)] bg-[var(--shell-glass)] text-[var(--shell-text)] backdrop-blur-xl hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-nav-hover-bg)] aria-expanded:bg-[var(--shell-nav-hover-bg)]",
        secondary:
          "border-[var(--shell-border)] bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] hover:-translate-y-px hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-md)] aria-expanded:bg-[var(--shell-surface-raised)]",
        ghost:
          "text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] aria-expanded:bg-[var(--shell-nav-hover-bg)] aria-expanded:text-[var(--shell-text)]",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15 focus-visible:ring-red-500/20",
        link: "text-[var(--shell-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-[var(--ds-button-height)] gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[10px] px-2 text-[11px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[var(--ds-radius-sm)] px-3 text-[12px] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-[var(--ds-radius-sm)] px-4 text-[14px] has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "size-[var(--ds-button-height)]",
        "icon-xs": "size-7 rounded-[10px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-[var(--ds-radius-sm)]",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2
          aria-hidden
          className="absolute size-4 animate-spin text-current opacity-80"
        />
      ) : null}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
