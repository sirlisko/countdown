import {
  isValidDate,
  normaliseDateOrder,
  getTimeDifferences,
  localDateAsUTC,
  nextYearly,
} from "./date";

describe("date util", () => {
  beforeAll(() => {
    const date = new Date(1998, 11, 19);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("isValidDate", () => {
    it("should return true if it is", () => {
      const date = new Date();
      expect(isValidDate(date)).toEqual(true);
    });
  });

  describe("normaliseDateOrder", () => {
    it("should not return the date inverted if then is in the future", () => {
      const now = new Date();
      const then = new Date(now.getFullYear() + 1, 0, 1);
      expect(normaliseDateOrder(now, then)).toEqual({
        from: now,
        to: then,
        isInverted: false,
      });
    });

    it("should return the date inverted if then is in the past", () => {
      const now = new Date();
      const then = new Date(now.getFullYear() - 1, 0, 1);
      expect(normaliseDateOrder(now, then)).toEqual({
        from: then,
        to: now,
        isInverted: true,
      });
    });
  });

  describe("getTimeDifferences", () => {
    it("should not return the date inverted if then is in the future", () => {
      const now = new Date();
      const to = new Date(now.getFullYear(), 0, 1);
      const then = new Date(now.getFullYear() + 1, 0, 2, 1, 2, 3);
      expect(getTimeDifferences(then, to)).toEqual({
        years: 1,
        days: 1,
        hours: 1,
        minutes: 2,
        seconds: 3,
      });
    });
  });
});

describe("localDateAsUTC", () => {
  const wallClock = (date: Date) => [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];

  it("should read the UTC fields as a local wall-clock time", () => {
    expect(wallClock(localDateAsUTC("2022-06-01T12:30:00.000Z"))).toEqual([
      2022, 5, 1, 12, 30,
    ]);
  });

  it("should not drift for historic dates", () => {
    expect(wallClock(localDateAsUTC("1476-09-04T00:00:00.000Z"))).toEqual([
      1476, 8, 4, 0, 0,
    ]);
  });
});

describe("nextYearly", () => {
  it("should keep a future date as it is", () => {
    const then = new Date(2030, 5, 1);
    expect(nextYearly(then, new Date(2026, 0, 1)).next).toBe(then);
  });

  it("should roll a past date to its next repeat", () => {
    const { next, previous } = nextYearly(
      new Date(1990, 4, 20, 9),
      new Date(2026, 8, 24),
    );
    expect(next).toEqual(new Date(2027, 4, 20, 9));
    expect(previous).toEqual(new Date(2026, 4, 20, 9));
  });

  it("should move on once the moment is reached", () => {
    const now = new Date(2026, 4, 20, 9);
    expect(nextYearly(new Date(1990, 4, 20, 9), now).next).toEqual(
      new Date(2027, 4, 20, 9),
    );
  });

  it("should bring 29 February back in leap years", () => {
    expect(
      nextYearly(new Date(2024, 1, 29), new Date(2027, 5, 1)).next,
    ).toEqual(new Date(2028, 1, 29));
  });

  it("should repeat at the same wall-clock time in a time zone", () => {
    const then = new Date("2020-07-01T10:00:00.000Z"); // 12:00 in Rome
    const { next } = nextYearly(then, new Date(2026, 8, 24), "Europe/Rome");
    expect(next).toEqual(new Date("2027-07-01T10:00:00.000Z"));
  });
});
