type CounterProps = {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
};

export function Counter({
  value,
  formatter = (next) => String(Math.round(next)),
  className,
}: CounterProps) {
  return <span className={className}>{formatter(value)}</span>;
}
