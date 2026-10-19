import { scrubAnalytics } from "./analytics";

const origin = "https://countdown.test";
const scrub = (payload: Record<string, string>) =>
  scrubAnalytics(payload, origin);

describe("scrubAnalytics", () => {
  it("should keep only the option names of a countdown", () => {
    expect(
      scrub({ url: `${origin}/?t=2030-01-01T00%3A00%3A00.000Z&m=Wedding&r=y` })
        .url,
    ).toBe(`${origin}/?m&r&t`);
  });

  it("should leave the home page alone", () => {
    expect(scrub({ url: `${origin}/` }).url).toBe(`${origin}/`);
  });

  it("should hide obfuscated links", () => {
    expect(scrub({ url: `${origin}/bT1XZWRkaW5n` }).url).toBe(
      `${origin}/hidden`,
    );
  });

  it("should scrub referrers from the site but not from elsewhere", () => {
    expect(scrub({ referrer: "/?m=Wedding&t=x" }).referrer).toBe("/?m&t");
    expect(scrub({ referrer: "https://example.com/?q=1" }).referrer).toBe(
      "https://example.com/?q=1",
    );
  });

  it("should replace the title, which holds the message", () => {
    expect(scrub({ title: "T-12d 01:00:00 · Wedding" }).title).toBe(
      "Countdown",
    );
  });

  it("should pass other fields through", () => {
    expect(scrub({ website: "id", url: `${origin}/` })).toMatchObject({
      website: "id",
    });
  });
});
