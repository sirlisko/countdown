import samples from "@/dates";
import { readCountdown } from "./location";

describe("readCountdown", () => {
  it("should read a countdown from the query string", () => {
    const countdown = readCountdown({
      pathname: "/",
      search: "?m=launch&t=2030-01-01T10%3A00%3A00.000Z&f=h%2Cs",
    });
    expect(countdown).toMatchObject({
      message: "launch",
      filters: ["h", "s"],
      obfuscate: false,
      isSample: false,
    });
    expect(countdown.then.getFullYear()).toBe(2030);
  });

  it("should read an obfuscated countdown from the path", () => {
    const countdown = readCountdown({
      pathname: `/${btoa("m=launch&t=2030-01-01T10%3A00%3A00.000Z")}`,
      search: "",
    });
    expect(countdown).toMatchObject({ message: "launch", obfuscate: true });
  });

  it("should ignore an invalid creation date", () => {
    const countdown = readCountdown({
      pathname: "/",
      search: "?t=2030-01-01T10%3A00%3A00.000Z&c=nope",
    });
    expect(countdown.created).toBeUndefined();
  });

  it("should return an invalid date when the path is not base64", () => {
    const countdown = readCountdown({ pathname: "/not-base64!", search: "" });
    expect(Number.isNaN(countdown.then.getTime())).toBe(true);
  });

  describe("samples", () => {
    const home = { pathname: "/", search: "" };
    const pick = (event: string) => {
      const index = samples.findIndex((sample) => sample.event === event);
      // The first roll skips the upcoming-only pool, the second picks the index
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.99)
        .mockReturnValueOnce((index + 0.5) / samples.length);
    };
    afterEach(() => vi.restoreAllMocks());

    it("should fall back to a sample countdown", () => {
      expect(readCountdown(home).isSample).toBe(true);
    });

    it.each(samples)("should resolve $event", (sample) => {
      pick(sample.event);
      const { then, message, timeZone } = readCountdown(home);
      expect(Number.isNaN(then.getTime())).toBe(false);
      expect(timeZone).toBe(sample.timeZone);
      expect(message).toBe(
        `${then > new Date() ? "until" : "since"} ${sample.event}`,
      );
    });

    it("should pin events to their own time zone", () => {
      pick("the Berlin Wall opened");
      expect(readCountdown(home).then).toEqual(
        new Date("1989-11-09T22:30:00.000Z"),
      );
    });
  });
});
