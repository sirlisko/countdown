import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const zones = Intl.supportedValuesOf("timeZone");
const listed = new Set(zones);

const regions = new Map<string, string[]>();
for (const zone of zones) {
  const region = zone.split("/")[0];
  regions.set(region, [...(regions.get(region) ?? []), zone]);
}

const label = (zone: string) => zone.replace(/_/g, " ").replace(/\//g, " / ");

const TimeZoneSelect = ({
  value,
  className,
  ...props
}: ComponentProps<"select"> & { value: string }) => {
  // The list leaves out UTC and aliases some browsers report, like Asia/Calcutta
  const extras = [...new Set(["UTC", value])].filter(
    (zone) => !listed.has(zone),
  );
  return (
    <select
      value={value}
      className={cn(
        "flex h-9 w-full border border-input bg-background px-3 py-1 font-mono text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {extras.map((zone) => (
        <option key={zone} value={zone}>
          {label(zone)}
        </option>
      ))}
      {[...regions].map(([region, inRegion]) => (
        <optgroup key={region} label={region}>
          {inRegion.map((zone) => (
            <option key={zone} value={zone}>
              {label(zone)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default TimeZoneSelect;
