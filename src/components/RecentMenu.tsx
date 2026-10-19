import { CountdownTimerIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RecentCountdown } from "@/utils/recent";

const RecentMenu = ({
  recent,
  onClear,
  className,
}: {
  recent: RecentCountdown[];
  onClear: () => void;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className={className} title="Recent countdowns">
        <CountdownTimerIcon className="size-4" />
        <span className="sr-only">Recent countdowns</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-72 max-w-[calc(100vw-2rem)] border-2 border-foreground font-mono"
    >
      {recent.map(({ href, message, then }) => (
        <DropdownMenuItem key={href} asChild>
          <a href={href} className="flex flex-col items-start gap-0.5">
            <span className="w-full truncate font-sans font-bold uppercase">
              {message || "Untitled"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {format(new Date(then), "EEE dd MMM yyyy · HH:mm")}
            </span>
          </a>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onClear}
        className="text-xs uppercase tracking-widest"
      >
        Clear list
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default RecentMenu;
