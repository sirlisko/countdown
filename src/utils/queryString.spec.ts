import { Countdown } from "@/types";
import { getQueryString, createQueryString } from "./queryString";

describe("queryString util", () => {
  it("should return the date parsed", () => {
    const searchString =
      "t=2020-01-11T00:00:00.000Z&m=to%20the%20next%20year&f=h";
    const parsedString = getQueryString(searchString);
    expect(parsedString).toEqual({
      filters: ["h"],
      message: "to the next year",
      then: new Date(2020, 0, 11),
      created: false,
      yearly: false,
    });
  });

  it("should read instants and the time zone when z is present", () => {
    const { then, timeZone } = getQueryString(
      "t=2026-12-31T22:00:00.000Z&z=Europe%2FRome",
    );
    expect(then).toEqual(new Date("2026-12-31T22:00:00.000Z"));
    expect(timeZone).toBe("Europe/Rome");
  });

  it("should keep instant mode with an unknown time zone", () => {
    const { then, timeZone } = getQueryString(
      "t=2026-12-31T22:00:00.000Z&z=Mars%2FOlympus",
    );
    expect(then).toEqual(new Date("2026-12-31T22:00:00.000Z"));
    expect(timeZone).toBeTruthy();
  });

  it("should parse the creation date", () => {
    const { created } = getQueryString(
      "t=2020-01-11T00:00:00.000Z&c=2019-06-01T12:30:00.000Z",
    );
    expect(created && [created.getDate(), created.getHours()]).toEqual([1, 12]);
  });
});

describe("createQueryString util", () => {
  it("should return the the correct query string", () => {
    const countdown: Countdown = {
      date: "2000-12-20",
      message: "asd",
      filters: ["m", "s"],
      time: "00:00",
    };
    const createdString = createQueryString(countdown);
    expect(createdString).toEqual(
      "f=m%2Cs&m=asd&t=2000-12-20T00%3A00%3A00.000Z",
    );
  });

  it("should not return filters if none selected", () => {
    const countdown = {
      date: "2000-12-20",
      message: "asd",
      filters: [],
      time: "17:30",
    };
    const createdString = createQueryString(countdown);
    expect(createdString).toEqual("m=asd&t=2000-12-20T17%3A30%3A00.000Z");
  });

  it("should store the instant and zone for same-moment countdowns", () => {
    const countdown = {
      date: "2026-12-31",
      filters: [],
      time: "23:00",
      sameMoment: true,
      timeZone: "Europe/Rome",
    };
    expect(createQueryString(countdown)).toEqual(
      "t=2026-12-31T22%3A00%3A00.000Z&z=Europe%2FRome",
    );
  });

  it("should add the creation date only when progress is enabled", () => {
    const countdown = {
      date: "2000-12-20",
      filters: [],
      time: "17:30",
      created: new Date(2000, 0, 1, 9).toISOString(),
    };
    expect(createQueryString(countdown)).toEqual(
      "t=2000-12-20T17%3A30%3A00.000Z",
    );
    expect(createQueryString({ ...countdown, progress: true })).toEqual(
      "c=2000-01-01T09%3A00%3A00.000Z&t=2000-12-20T17%3A30%3A00.000Z",
    );
  });

  it("should mark yearly countdowns", () => {
    expect(
      createQueryString({
        date: "2000-05-20",
        time: "09:00",
        filters: [],
        yearly: true,
      }),
    ).toEqual("r=y&t=2000-05-20T09%3A00%3A00.000Z");
  });
});
