const atYear = (year: number) => {
  const date = new Date(2000, 0, 1);
  date.setFullYear(year);
  return date;
};

const countdowns: { date: Date; text: string; filters?: string[] }[] = [
  {
    date: new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0),
    text: "until the start of next year",
  },
  {
    date: new Date(new Date().getFullYear(), 0, 1, 0, 0, 0),
    text: "since the start of this year",
  },
  {
    date: new Date(Date.UTC(1969, 6, 20, 20, 17)), // July 20, 1969, 20:17 UTC
    text: "since the Moon landing",
  },
  {
    date: new Date(1985, 9, 26, 9, 0), // October 26, 1985, 09:00
    text: "since Doc and Marty went Back to the Future",
  },
  {
    date: new Date(Date.UTC(1912, 3, 15, 5, 20)), // April 15, 1912, 05:20 UTC
    text: "since the sinking of the Titanic",
  },
  {
    date: new Date(1990, 10, 12, 0, 0), // November 12, 1990
    text: "since the first webpage went live (birth of the World Wide Web)",
  },
  {
    date: new Date(1989, 10, 9, 0, 0), // November 9, 1989
    text: "since the fall of the Berlin Wall",
  },
  {
    date: new Date(1977, 4, 25, 0, 0), // May 25, 1977
    text: "since the release of Star Wars: A New Hope",
  },
  {
    date: new Date(1969, 7, 15, 0, 0), // August 15, 1969
    text: "since Woodstock music festival began",
  },
  {
    date: new Date(1789, 6, 14, 0, 0), // July 14, 1789
    text: "since the storming of the Bastille",
  },
  {
    date: new Date(1903, 11, 17, 0, 0), // December 17, 1903
    text: "since the Wright brothers' first successful flight",
  },
  {
    date: new Date(1957, 9, 4, 0, 0), // October 4, 1957
    text: "since the launch of Sputnik (first artificial satellite)",
  },
  {
    date: new Date(1889, 2, 31, 0, 0), // March 31, 1889
    text: "since the Eiffel Tower opened to the public",
  },
  {
    date: new Date(2100, 0, 1, 0, 0), // January 1, 2100
    text: "until the start of the 22nd century",
  },
  {
    date: new Date(2030, 0, 1, 0, 0), // January 1, 2030
    text: "until the start of the next decade",
  },
  {
    date: new Date(2000, 0, 1, 0, 0), // January 1, 2000
    text: "since the start of this millennium",
    filters: ["m", "s", "h"],
  },
  {
    // JS maps years 0-99 to 19xx, so set the year explicitly
    date: atYear(1), // January 1, 1 AD
    text: "since the start of the Anno Domini (AD) era",
    filters: ["m", "s", "h"],
  },
  {
    date: new Date(476, 8, 4, 0, 0), // September 4, 476
    text: "since the fall of the Western Roman Empire",
  },
  {
    date: new Date(1215, 5, 15, 0, 0), // June 15, 1215
    text: "since the signing of the Magna Carta",
  },
  {
    date: new Date(1492, 9, 12, 0, 0), // October 12, 1492
    text: "since Christopher Columbus arrived in the Americas",
  },
];

export default countdowns;
