import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFullscreen } from "@/hooks/use-fullscreen";
import { useNow } from "@/hooks/use-now";
import type { Countdown as CountdownType } from "@/types";
import {
  formatCompact,
  isValidDate,
  nextYearly,
  normaliseDateOrder,
} from "@/utils/date";
import { readCountdown } from "@/utils/location";
import { wallClockIn } from "@/utils/timezone";
import Countdown from "./Counter/Countdown";
import Footer from "./Footer";
import Header from "./Header";
import Headline from "./Headline";
import InvalidLink from "./InvalidLink";
import ZeroFlash from "./ZeroFlash";

const CountdownPage = () => {
  const [countdown] = useState(() => readCountdown(window.location));
  const { then, created, timeZone, yearly, message, filters, isSample } =
    countdown;
  const now = useNow();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const [showZero, setShowZero] = useState(false);
  const dismissZero = useCallback(() => setShowZero(false), []);

  const isValid = isValidDate(then);
  const repeat =
    isValid && yearly ? nextYearly(then, now, timeZone) : undefined;
  const target = repeat?.next ?? then;
  const isPast = now.getTime() >= target.getTime();

  // Flash when the target seen on the previous tick has just been reached,
  // which also catches yearly countdowns rolling over to next year
  const previousTick = useRef({ now, target });
  useEffect(() => {
    const previous = previousTick.current;
    if (isValid && previous.target > previous.now && previous.target <= now) {
      setShowZero(true);
    }
    previousTick.current = { now, target };
  }, [isValid, now, target]);

  useEffect(() => {
    document.documentElement.dataset.phase = isPast ? "past" : "future";
  }, [isPast]);

  const { from, to, isInverted } = normaliseDateOrder(now, target);

  useEffect(() => {
    const label = message && !isSample ? message : "Countdown";
    document.title = isValid
      ? `T${isInverted ? "+" : "-"}${formatCompact(to, from)} · ${label}`
      : "Countdown";
  }, [isValid, isInverted, from, to, message, isSample]);

  const defaultValues = useMemo<CountdownType | undefined>(
    () =>
      isValid
        ? {
            message,
            ...(timeZone
              ? wallClockIn(then, timeZone)
              : {
                  date: format(then, "yyyy-MM-dd"),
                  time: format(then, "HH:mm"),
                }),
            filters,
            obfuscate: countdown.obfuscate,
            progress: !!created,
            created: created?.toISOString(),
            sameMoment: !!timeZone,
            timeZone,
            yearly,
          }
        : undefined,
    [countdown, isValid, message, then, created, timeZone, yearly, filters],
  );

  const calendarEvent = useMemo(
    () =>
      isValid
        ? {
            title: (!isSample && message) || "Countdown",
            start: then,
            url: window.location.href,
            timeZone,
            yearly,
          }
        : undefined,
    [isValid, yearly, then, isSample, message, timeZone],
  );

  const progressStart =
    created && repeat && repeat.previous > created ? repeat.previous : created;

  return (
    <div className="flex min-h-dvh flex-col">
      {!isFullscreen && (
        <Header
          isPast={isValid ? isPast : undefined}
          defaultValues={defaultValues}
          calendarEvent={isPast && !yearly ? undefined : calendarEvent}
          onFullscreen={toggleFullscreen}
        />
      )}
      <main className="flex flex-1 flex-col justify-between gap-12 px-4 py-8 sm:px-8 sm:py-12">
        {isValid ? (
          <>
            <Headline
              message={message}
              then={target}
              timeZone={timeZone}
              yearly={yearly}
            />
            <Countdown
              from={from}
              to={to}
              filters={filters}
              isInverted={isInverted}
              progress={
                progressStart && progressStart < target
                  ? { start: progressStart, end: target, now }
                  : undefined
              }
            />
          </>
        ) : (
          <InvalidLink />
        )}
      </main>
      {!isFullscreen && <Footer />}
      {showZero && <ZeroFlash message={message} onDismiss={dismissZero} />}
    </div>
  );
};

export default CountdownPage;
