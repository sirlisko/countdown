import {
  isValidDate,
  normaliseDateOrder,
  getTimeDifferences,
  localDateAsUTC,
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
