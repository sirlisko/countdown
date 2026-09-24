import { getTimeDifferences } from "../../utils/date";

import FlipNumbers from "./FlipNumbers";
import CountdownFilters from "./CountdownFilters";

import { CountdownFromString } from "../../types";

const Countdown = ({ from, to, filters, isInverted }: CountdownFromString) => {
  const { years, days, hours, minutes, seconds } = getTimeDifferences(to, from);
  return (
    <div style={{ margin: filters.length ? "10vh auto" : "20vh auto" }}>
      <div className="text-[6vw] flex">
        {years > 0 && (
          <>
            <FlipNumbers number={years} isInverted={isInverted} />y
          </>
        )}
        {days > 0 && (
          <>
            <FlipNumbers number={days} isInverted={isInverted} />d
          </>
        )}
        <FlipNumbers number={hours} isInverted={isInverted} /> :
        <FlipNumbers number={minutes} isInverted={isInverted} /> :
        <FlipNumbers number={seconds} isInverted={isInverted} />
      </div>
      {filters.length > 0 && (
        <CountdownFilters from={from} to={to} filters={filters} />
      )}
    </div>
  );
};

export default Countdown;
