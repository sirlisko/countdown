import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";

import { useFullscreen } from "@/hooks/use-fullscreen";
import { useNow } from "@/hooks/use-now";
import { isValidDate, normaliseDateOrder } from "@/utils/date";
import { readCountdown } from "@/utils/location";
import type { Countdown as CountdownType } from "@/types";
import Countdown from "./Counter/Countdown";
import Footer from "./Footer";
import Header from "./Header";
import Headline from "./Headline";
import ZeroFlash from "./ZeroFlash";

const CountdownPage = () => {
  const [{ then, message, filters, obfuscate, isSample }] = useState(() =>
    readCountdown(window.location),
  );
  const now = useNow();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const [showZero, setShowZero] = useState(false);
  const dismissZero = useCallback(() => setShowZero(false), []);

  const isValid = isValidDate(then);
  const isPast = now.getTime() >= then.getTime();

  const wasPast = useRef(isPast);
  useEffect(() => {
    if (isValid && isPast && !wasPast.current) setShowZero(true);
    wasPast.current = isPast;
  }, [isValid, isPast]);

  useEffect(() => {
    document.documentElement.dataset.phase = isPast ? "past" : "future";
    const prefix = message && !isSample ? `${message} - ` : "";
    document.title = `${prefix}${isPast ? "How long ago?" : "How much time left?"} - Countdown`;
  }, [isPast, message, isSample]);

  const defaultValues = useMemo<CountdownType | undefined>(
    () =>
      isValid
        ? {
            message,
            date: format(then, "yyyy-MM-dd"),
            time: format(then, "HH:mm"),
            filters,
            obfuscate,
          }
        : undefined,
    [isValid, message, then, filters, obfuscate],
  );

  const { from, to, isInverted } = normaliseDateOrder(now, then);

  return (
    <div className="flex min-h-dvh flex-col">
      {!isFullscreen && (
        <Header
          isPast={isValid ? isPast : undefined}
          defaultValues={defaultValues}
          onFullscreen={toggleFullscreen}
        />
      )}
      <main className="flex flex-1 flex-col justify-between gap-12 px-4 py-8 sm:px-8 sm:py-12">
        {isValid ? (
          <>
            <Headline message={message} then={then} />
            <Countdown
              from={from}
              to={to}
              filters={filters}
              isInverted={isInverted}
            />
          </>
        ) : (
          <section className="flex flex-col gap-6">
            <p className="font-mono text-xs uppercase tracking-widest">
              <span className="bg-destructive px-1.5 py-0.5 text-destructive-foreground">
                Err
              </span>{" "}
              This link doesn't hold a valid date
            </p>
            <h1 className="text-[clamp(3rem,12vw,12rem)] font-bold uppercase leading-[0.8] tracking-tighter">
              Invalid
              <br />
              date.
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Hit “New” to make your own.
            </p>
          </section>
        )}
      </main>
      {!isFullscreen && <Footer />}
      {showZero && <ZeroFlash message={message} onDismiss={dismissZero} />}
    </div>
  );
};

export default CountdownPage;
