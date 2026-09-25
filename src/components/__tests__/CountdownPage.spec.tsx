// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountdownPage from "../CountdownPage";

const visit = (path: string) => window.history.replaceState(null, "", path);

describe("CountdownPage", () => {
  it("should explain a broken link", () => {
    visit("/not-base64!");
    render(<CountdownPage />);
    expect(
      screen.getByText("This link doesn't hold a valid date"),
    ).toBeInTheDocument();
    expect(document.title).toBe("Countdown");
  });

  it("should count down to a shared target", () => {
    visit("/?m=Launch&t=2999-01-01T00%3A00%3A00.000Z&z=UTC");
    render(<CountdownPage />);
    expect(screen.getByRole("heading", { name: "Launch" })).toBeInTheDocument();
    expect(screen.getByText("T-minus")).toBeInTheDocument();
    expect(document.title).toMatch(/^T-\d+y \d+d \d\d:\d\d:\d\d · Launch$/);
    expect(document.documentElement.dataset.phase).toBe("future");
  });

  it("should roll yearly countdowns forward", () => {
    visit("/?m=Birthday&t=1990-05-20T09%3A00%3A00.000Z&r=y");
    render(<CountdownPage />);
    expect(screen.getByText("Every year")).toBeInTheDocument();
    expect(screen.getByText("T-minus")).toBeInTheDocument();
    expect(screen.queryByText("Years")).not.toBeInTheDocument();
  });

  it("should count up from a past one-off date", () => {
    visit("/?m=Moon&t=1969-07-20T20%3A17%3A00.000Z&z=UTC");
    render(<CountdownPage />);
    expect(screen.getByText("T-plus")).toBeInTheDocument();
    expect(document.documentElement.dataset.phase).toBe("past");
    expect(
      screen.queryByRole("button", { name: "Add to calendar" }),
    ).not.toBeInTheDocument();
  });

  it("should invite visitors to make their own from a sample", async () => {
    visit("/");
    render(<CountdownPage />);
    expect(screen.getByText("Example")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Make your own →" }),
    );
    expect(
      screen.getByRole("dialog", { name: "New countdown" }),
    ).toBeInTheDocument();
  });

  it("should not flag shared countdowns as examples", () => {
    visit("/?m=Launch&t=2999-01-01T00%3A00%3A00.000Z&z=UTC");
    render(<CountdownPage />);
    expect(screen.queryByText("Example")).not.toBeInTheDocument();
  });
});
