import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarEvent,
  downloadICS,
  toGoogleCalendarUrl,
} from "@/utils/calendar";

const CalendarMenu = ({
  event,
  className,
}: {
  event: CalendarEvent;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className={className} title="Add to calendar">
        <CalendarIcon className="size-4" />
        <span className="sr-only">Add to calendar</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="border-2 border-foreground font-mono uppercase tracking-widest"
    >
      <DropdownMenuItem onClick={() => downloadICS(event)}>
        Download .ics
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a
          href={toGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Calendar ↗
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default CalendarMenu;
