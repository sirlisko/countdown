import { cn } from "@/lib/utils";

const TickNumber = ({
  value,
  isInverted,
}: {
  value: number;
  isInverted?: boolean;
}) => {
  const text = value.toString().padStart(2, "0");
  return (
    <span
      aria-hidden
      className="block self-end whitespace-nowrap font-mono font-extrabold text-(length:--fit) leading-[0.8] tabular-nums tracking-tighter sm:text-(length:--fit-sm)"
    >
      {text.split("").map((digit, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: keyed from the right so a digit only re-animates when it changes
          key={`${text.length - index}-${digit}`}
          className={cn(
            "inline-block",
            isInverted ? "animate-tick-inverted" : "animate-tick",
          )}
        >
          {digit}
        </span>
      ))}
    </span>
  );
};

export default TickNumber;
