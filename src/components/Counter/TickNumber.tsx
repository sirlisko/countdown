import { cn } from "@/lib/utils";

// JetBrains Mono glyphs advance 0.6em, so this fills the cell's width
const MONO_ADVANCE = 0.6;

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
      className="block self-end whitespace-nowrap font-mono font-extrabold leading-[0.8] tabular-nums tracking-tighter"
      style={{
        fontSize: `min(calc(92cqi / ${text.length * MONO_ADVANCE}), 34vh)`,
      }}
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
