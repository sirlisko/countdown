import { useEffect, useState } from "react";

// Ticks fire just after each wall-clock second; rounding snaps them onto it
const currentSecond = () => new Date(Math.round(Date.now() / 1000) * 1000);

export const useNow = () => {
  const [now, setNow] = useState(currentSecond);

  useEffect(() => {
    let timeout: number;
    const schedule = () => {
      timeout = window.setTimeout(
        () => {
          setNow(currentSecond());
          schedule();
        },
        1000 - (Date.now() % 1000),
      );
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return now;
};
