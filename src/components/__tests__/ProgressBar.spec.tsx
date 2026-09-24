// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import ProgressBar from "../Counter/ProgressBar";

const start = new Date(2026, 0, 1);
const end = new Date(2026, 0, 5);

describe("ProgressBar", () => {
  it("should report how far along it is", () => {
    render(<ProgressBar start={start} end={end} now={new Date(2026, 0, 2)} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    expect(screen.getByText("25.0000%")).toBeInTheDocument();
  });

  it("should stay within 0 and 100", () => {
    render(<ProgressBar start={start} end={end} now={new Date(2027, 0, 1)} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
