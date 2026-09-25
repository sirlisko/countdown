// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import Countdown from "../Counter/Countdown";

const from = new Date(2026, 0, 1);

describe("Countdown", () => {
  it("should show only the units that matter", () => {
    render(
      <Countdown from={from} to={new Date(2026, 0, 1, 1, 2, 3)} filters={[]} />,
    );
    expect(screen.queryByText("Days")).not.toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveAccessibleName(
      "1 hours, 2 minutes left",
    );
  });

  it("should show years and days for long spans", () => {
    render(
      <Countdown
        from={from}
        to={new Date(2028, 0, 11)}
        filters={[]}
        isInverted
      />,
    );
    expect(screen.getByText("Years")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveAccessibleName(
      "2 years, 10 days, 0 hours, 0 minutes ago",
    );
  });

  it("should show the requested totals", () => {
    render(
      <Countdown from={from} to={new Date(2026, 0, 3)} filters={["h", "s"]} />,
    );
    expect(screen.getByText("Total hours").nextSibling).toHaveTextContent("48");
    expect(screen.getByText("Total seconds")).toBeInTheDocument();
    expect(screen.queryByText("Total minutes")).not.toBeInTheDocument();
  });
});
