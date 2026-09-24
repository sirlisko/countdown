import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getQueryString } from "../utils/queryString";
import { isValidDate, normaliseDateOrder } from "../utils/date";
import DialogNew from "./DialogNew";

import dates from "../dates";
import type { Countdown as CountdownType } from "@/types";
import Countdown from "./Counter/Countdown";
import DynammicTitle from "./Counter/DynamicTitle";

const CountdownPage: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [then, setThen] = useState<Date>();
  const [message, setMessage] = useState<string>();
  const [filters, setFilters] = useState<string[]>([]);
  const [obfuscate, setObfuscate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);

    const path = window.location.pathname.split("/").pop();
    const searchParams = new URLSearchParams(window.location.search);

    let decoded: string;
    try {
      decoded = path ? atob(path) : searchParams.toString();
    } catch {
      setThen(new Date(NaN));
      return () => clearInterval(interval);
    }
    const qs = getQueryString(decoded);
    setObfuscate(!!path);

    if (qs && qs.then) {
      const { message, then, filters } = qs;
      setThen(then);
      setMessage(message || "\u00A0");
      if (filters) setFilters(filters);

      document.title =
        new Date().getTime() < then.getTime()
          ? `${message ? message + " - " : ""}How much time left? - Countdown`
          : `${message ? message + " - " : ""}How long ago? - Countdown`;
    } else {
      const { date, text, filters } =
        dates[Math.floor(Math.random() * dates.length)];
      setThen(date);
      setMessage(text);
      if (filters) setFilters(filters);
    }

    return () => clearInterval(interval);
  }, []);

  if (!then) {
    return null;
  }

  const { from, to, isInverted } = normaliseDateOrder(now, then);

  if (!isValidDate(then)) {
    return (
      <div className="flex h-screen">
        <div className="m-auto text-center text-2xl p-3">
          Oops! Something went wrong with your date
          <div className="text-center mt-20">
            <DialogNew />
          </div>
        </div>
      </div>
    );
  }

  const defaultValues: CountdownType = {
    message,
    date: format(then, "yyyy-MM-dd"),
    time: format(then, "HH:mm"),
    filters,
    obfuscate,
  };

  return (
    <>
      <DynammicTitle message={message} />
      <Countdown
        from={from}
        to={to}
        filters={filters}
        isInverted={isInverted}
      />
      <div className="text-center">
        <DialogNew defaultValues={defaultValues} />
      </div>
    </>
  );
};

export default CountdownPage;
