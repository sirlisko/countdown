// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import ZeroFlash from "../ZeroFlash";

describe("ZeroFlash", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show the message", () => {
    render(<ZeroFlash message="Launch" onDismiss={() => {}} />);
    expect(screen.getByText("T-0 · Launch")).toBeInTheDocument();
  });

  it("should dismiss on click and Escape", () => {
    const onDismiss = vi.fn();
    render(<ZeroFlash onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("should dismiss itself after a few seconds", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<ZeroFlash onDismiss={onDismiss} />);
    vi.advanceTimersByTime(8000);
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
