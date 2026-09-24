const ProgressBar = ({
  start,
  end,
  now,
}: {
  start: Date;
  end: Date;
  now: Date;
}) => {
  const span = end.getTime() - start.getTime();
  const ratio = Math.min(
    1,
    Math.max(0, (now.getTime() - start.getTime()) / span),
  );
  const percent = (ratio * 100).toFixed(4);

  return (
    <div className="flex items-stretch border-2 border-b-0 border-foreground font-mono text-[10px] uppercase tracking-widest sm:text-xs">
      <span className="hidden items-center border-r-2 border-foreground px-2 sm:flex sm:px-4">
        Progress
      </span>
      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percent)}
        className="relative min-h-8 flex-1 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(10%-1px),hsl(var(--foreground)/0.25)_calc(10%-1px),hsl(var(--foreground)/0.25)_10%)] sm:min-h-10"
      >
        <div
          className="absolute inset-y-0 left-0 bg-[repeating-linear-gradient(-45deg,hsl(var(--foreground))_0,hsl(var(--foreground))_6px,transparent_6px,transparent_9px)]"
          style={{ width: `${ratio * 100}%` }}
        />
        {ratio > 0 && ratio < 1 && (
          <div
            className="absolute inset-y-0 w-1.5 -translate-x-full bg-signal"
            style={{ left: `${ratio * 100}%` }}
          />
        )}
      </div>
      <span className="flex min-w-[9ch] items-center justify-end border-l-2 border-foreground px-2 tabular-nums sm:min-w-[11ch] sm:px-4">
        {percent}%
      </span>
    </div>
  );
};

export default ProgressBar;
