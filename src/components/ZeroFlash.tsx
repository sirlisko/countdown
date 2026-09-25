import { useEffect } from "react";

const ZeroFlash = ({
  message,
  onDismiss,
}: {
  message?: string;
  onDismiss: () => void;
}) => {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, 8000);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKey);
    };
  }, [onDismiss]);

  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-live="assertive"
      className="animate-zero-flash fixed inset-0 z-50 flex flex-col items-start justify-end gap-6 p-6 text-left sm:p-12"
    >
      {message && (
        <span className="font-mono text-xs uppercase tracking-widest sm:text-sm">
          T-0 · {message}
        </span>
      )}
      <span className="text-[28vw] font-bold uppercase leading-[0.75] tracking-tighter">
        Zero.
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-70 sm:text-xs">
        Click or press Esc to dismiss
      </span>
    </button>
  );
};

export default ZeroFlash;
