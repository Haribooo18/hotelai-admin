import type { ButtonProps } from "./Button";
import { Button } from "./Button";

type IconButtonProps = Omit<ButtonProps, "size"> & {
  size?: Extract<
    ButtonProps["size"],
    "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  >;
};

export function IconButton({
  size = "icon",
  ...props
}: IconButtonProps) {
  return <Button size={size} {...props} />;
}
