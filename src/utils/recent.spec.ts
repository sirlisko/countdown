// @vitest-environment jsdom
import { clearRecent, readRecent, rememberCountdown } from "./recent";

const entry = (n: number) => ({
  href: `https://countdown.test/?n=${n}`,
  message: `Event ${n}`,
  then: "2030-01-01T00:00:00.000Z",
});

describe("recent countdowns", () => {
  beforeEach(() => localStorage.clear());

  it("should keep the newest first without duplicates", () => {
    rememberCountdown(entry(1));
    rememberCountdown(entry(2));
    rememberCountdown(entry(1));
    expect(readRecent().map(({ message }) => message)).toEqual([
      "Event 1",
      "Event 2",
    ]);
  });

  it("should cap the list", () => {
    for (let n = 0; n < 12; n++) rememberCountdown(entry(n));
    expect(readRecent()).toHaveLength(8);
    expect(readRecent()[0].message).toBe("Event 11");
  });

  it("should ignore storage it can't read", () => {
    localStorage.setItem("countdown-recent", "{not json");
    expect(readRecent()).toEqual([]);
    localStorage.setItem("countdown-recent", JSON.stringify([{ href: 1 }]));
    expect(readRecent()).toEqual([]);
  });

  it("should clear the list", () => {
    rememberCountdown(entry(1));
    clearRecent();
    expect(readRecent()).toEqual([]);
  });
});
