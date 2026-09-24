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

  it("should return an invalid date when the path is not base64", () => {
    const countdown = readCountdown({ pathname: "/not-base64!", search: "" });
    expect(Number.isNaN(countdown.then.getTime())).toBe(true);
  });

  it("should fall back to a sample countdown", () => {
    expect(readCountdown({ pathname: "/", search: "" }).isSample).toBe(true);
  });
});
