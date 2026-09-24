import { toGoogleCalendarUrl, toICS } from "./calendar";

const url = "https://countdown.sirlisko.com/?m=Launch";

describe("toICS", () => {
  it("should use UTC times for same-moment countdowns", () => {
    const ics = toICS(
      {
        title: "Launch",
        start: new Date("2026-12-31T22:00:00.000Z"),
        url,
        timeZone: "Europe/Rome",
      },
      new Date("2026-09-24T10:00:00.000Z"),
    );
    expect(ics).toContain("DTSTART:20261231T220000Z\r\n");
    expect(ics).toContain("DTEND:20261231T230000Z\r\n");
    expect(ics).toContain("DTSTAMP:20260924T100000Z\r\n");
    expect(ics).not.toContain("RRULE");
  });

  it("should use floating times for local-time countdowns", () => {
    const ics = toICS({ title: "NYE", start: new Date(2026, 11, 31), url });
    expect(ics).toContain("DTSTART:20261231T000000\r\n");
  });

  it("should repeat yearly countdowns", () => {
    const ics = toICS({
      title: "Birthday",
      start: new Date(1990, 4, 20),
      url,
      yearly: true,
    });
    expect(ics).toContain("RRULE:FREQ=YEARLY\r\n");
  });

  it("should escape and fold long text", () => {
    const ics = toICS({
      title: `Launch; v2, a\\b finally ${"🚀".repeat(30)}`,
      start: new Date(2026, 11, 31),
      url,
    });
    expect(ics).toContain("SUMMARY:Launch\\; v2\\, a\\\\b finally");
    for (const line of ics.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(ics.replace(/\r\n /g, "")).toContain("🚀".repeat(30));
  });
});

describe("toGoogleCalendarUrl", () => {
  it("should pass the creator's time zone for same-moment countdowns", () => {
    const params = new URL(
      toGoogleCalendarUrl({
        title: "Launch",
        start: new Date("2026-12-31T22:00:00.000Z"),
        url,
        timeZone: "Europe/Rome",
        yearly: true,
      }),
    ).searchParams;
    expect(params.get("dates")).toBe("20261231T230000/20270101T000000");
    expect(params.get("ctz")).toBe("Europe/Rome");
    expect(params.get("recur")).toBe("RRULE:FREQ=YEARLY");
  });
});
