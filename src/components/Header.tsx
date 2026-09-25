import { EnterFullScreenIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { isFullscreenSupported } from "@/hooks/use-fullscreen";
import type { Countdown } from "@/types";
import type { CalendarEvent } from "@/utils/calendar";
import CalendarMenu from "./CalendarMenu";
import DialogNew, { type DialogState } from "./DialogNew";
import { ModeToggle } from "./mode-toggler";

const cell = "h-full border-l-2 border-foreground px-3 sm:px-4";

const Header = ({
  isPast,
  defaultValues,
  calendarEvent,
  dialog,
  onDialogChange,
  onFullscreen,
}: {
  isPast?: boolean;
  defaultValues?: Countdown;
  calendarEvent?: CalendarEvent;
  dialog: DialogState;
  onDialogChange: (state: DialogState) => void;
  onFullscreen: () => void;
}) => (
  <header className="flex h-14 items-stretch border-b-2 border-foreground font-mono text-xs uppercase tracking-widest">
    <a
      href="/"
      className="flex items-center gap-2 px-4 font-bold hover:bg-foreground hover:text-background"
    >
      <span className="size-3 border-2 border-foreground bg-signal" />
      <span className="hidden sm:inline">Countdown</span>
    </a>
    {isPast !== undefined && (
      <div className="flex items-center border-l-2 border-foreground px-3 sm:px-4">
        <span className="flex items-center gap-2 bg-signal px-2 py-1 font-bold text-signal-foreground">
          <span className="size-1.5 animate-blink bg-current" />
          {isPast ? "T-plus" : "T-minus"}
        </span>
      </div>
    )}
    <nav className="ml-auto flex items-stretch">
      <DialogNew
        defaultValues={defaultValues}
        triggerClassName={cell}
        state={dialog}
        onStateChange={onDialogChange}
      />
      {calendarEvent && <CalendarMenu event={calendarEvent} className={cell} />}
      {isFullscreenSupported && (
        <Button
          variant="ghost"
          className={`${cell} hidden sm:inline-flex`}
          onClick={onFullscreen}
          title="Fullscreen (F)"
        >
          <EnterFullScreenIcon className="size-4" />
          <span className="sr-only">Fullscreen</span>
        </Button>
      )}
      <ModeToggle className={cell} />
    </nav>
  </header>
);

export default Header;
