import {
  addYearsInZone,
  isValidTimeZone,
  wallClockIn,
  zonedWallClockToInstant,
} from "./timezone";

describe("zonedWallClockToInstant", () => {
  it("should resolve a wall-clock time in winter and summer", () => {
    expect(
      zonedWallClockToInstant("2026-12-31", "23:00", "Europe/Rome"),
    ).toEqual(new Date("2026-12-31T22:00:00.000Z"));
    expect(
      zonedWallClockToInstant("2026-07-01", "09:30", "America/New_York"),
    ).toEqual(new Date("2026-07-01T13:30:00.000Z"));
  });

  it("should handle half-hour offsets", () => {
    expect(
      zonedWallClockToInstant("2026-01-01", "00:00", "Asia/Kolkata"),
    ).toEqual(new Date("2025-12-31T18:30:00.000Z"));
  });

  it("should handle times right after a DST change", () => {
    expect(
      zonedWallClockToInstant("2026-03-29", "03:30", "Europe/London"),
    ).toEqual(new Date("2026-03-29T02:30:00.000Z"));
  });

  it("should keep seconds when given", () => {
    expect(zonedWallClockToInstant("2038-01-19", "03:14:08", "UTC")).toEqual(
      new Date("2038-01-19T03:14:08.000Z"),
    );
  });

  it("should handle years below 100", () => {
    expect(
      zonedWallClockToInstant("0050-06-01", "12:00", "UTC").getUTCFullYear(),
    ).toBe(50);
  });
});

describe("wallClockIn", () => {
  it("should format an instant in a given time zone", () => {
    expect(
      wallClockIn(new Date("2026-12-31T22:00:00.000Z"), "Asia/Tokyo"),
    ).toEqual({ date: "2027-01-01", time: "07:00" });
  });
});

describe("addYearsInZone", () => {
  it("should keep the wall-clock time across DST differences", () => {
    // 29 Mar 2026 is after the EU switch to summer time, 29 Mar 2025 before
    const target = zonedWallClockToInstant(
      "2025-03-29",
      "12:00",
      "Europe/Rome",
    );
    expect(
      wallClockIn(addYearsInZone(target, 1, "Europe/Rome"), "Europe/Rome"),
    ).toEqual({ date: "2026-03-29", time: "12:00" });
  });

  it("should clamp 29 February to the 28th in common years", () => {
    const leap = zonedWallClockToInstant("2028-02-29", "10:00", "UTC");
    expect(wallClockIn(addYearsInZone(leap, 1, "UTC"), "UTC")).toEqual({
      date: "2029-02-28",
      time: "10:00",
    });
  });
});

describe("isValidTimeZone", () => {
  it("should validate IANA names", () => {
    expect(isValidTimeZone("Europe/London")).toBe(true);
    expect(isValidTimeZone("Mars/Olympus")).toBe(false);
  });
});
