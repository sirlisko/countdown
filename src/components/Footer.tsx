import { isFullscreenSupported } from "@/hooks/use-fullscreen";

const link = "underline-offset-4 hover:bg-signal hover:text-signal-foreground";

const Footer = () => (
  <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t-2 border-foreground px-4 py-3 font-mono text-[10px] uppercase tracking-widest sm:text-xs">
    <span>
      Built by{" "}
      <a
        className={link}
        href="https://sirlisko.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        sirlisko ↗
      </a>
    </span>
    {isFullscreenSupported && (
      <span className="hidden text-muted-foreground sm:inline">
        [F] Fullscreen
      </span>
    )}
    <a
      className={link}
      href="https://github.com/sirLisko/countdown"
      target="_blank"
      rel="noopener noreferrer"
    >
      Source ↗
    </a>
  </footer>
);

export default Footer;
