export interface Sample {
  event: string;
  date: string;
  time?: string;
  // Omitted for moments that belong to the viewer, like their own New Year
  timeZone?: string;
  filters?: string[];
}

const year = new Date().getFullYear();
const nextDecade = Math.floor(year / 10) * 10 + 10;
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const leapAfter = (from: number) => {
  let y = from;
  while (!isLeap(y)) y++;
  return y;
};
// In a non-leap year new Date(year, 1, 29) rolls to 1 March, which still works
const nextLeapDay = leapAfter(
  new Date() < new Date(year, 1, 29) ? year : year + 1,
);

// Pre-1582 dates are converted from the Julian calendar, since elapsed time
// is counted on the proleptic Gregorian one
const samples: Sample[] = [
  { event: "the start of next year", date: `${year + 1}-01-01` },
  { event: "the start of this year", date: `${year}-01-01` },
  { event: "the start of the next decade", date: `${nextDecade}-01-01` },
  { event: "the next leap day", date: `${nextLeapDay}-02-29` },
  { event: "the year 2100", date: "2100-01-01" },
  {
    event: "Y2K",
    date: "2000-01-01",
    filters: ["m", "s", "h"],
  },
  {
    event: "the start of the Anno Domini era",
    date: "0001-01-01",
    filters: ["m", "s", "h"],
  },
  {
    event: "the Year 2038 problem",
    date: "2038-01-19",
    time: "03:14:08",
    timeZone: "UTC",
  },
  {
    event: "Unix time 2,000,000,000",
    date: "2033-05-18",
    time: "03:33:20",
    timeZone: "UTC",
  },
  {
    event: "the 2027 total solar eclipse",
    date: "2027-08-02",
    time: "10:07",
    timeZone: "UTC",
  },
  {
    event: "the LA 2028 Olympics opening",
    date: "2028-07-14",
    timeZone: "America/Los_Angeles",
  },
  {
    event: "the return of Halley's Comet",
    date: "2061-07-28",
    timeZone: "UTC",
  },
  {
    event: "the Moon landing",
    date: "1969-07-20",
    time: "20:17",
    timeZone: "UTC",
  },
  {
    event: "Marty McFly came back to the future",
    date: "1985-10-26",
    time: "01:24",
    timeZone: "America/Los_Angeles",
  },
  {
    event: "the Titanic sank",
    date: "1912-04-15",
    time: "05:20",
    timeZone: "UTC",
  },
  {
    event: "the first website went live",
    date: "1990-12-20",
    timeZone: "Europe/Zurich",
  },
  {
    event: "the Berlin Wall opened",
    date: "1989-11-09",
    time: "23:30",
    timeZone: "Europe/Berlin",
  },
  {
    event: "Star Wars hit cinemas",
    date: "1977-05-25",
    timeZone: "America/Los_Angeles",
  },
  {
    event: "Woodstock began",
    date: "1969-08-15",
    time: "17:07",
    timeZone: "America/New_York",
  },
  {
    event: "the storming of the Bastille",
    date: "1789-07-14",
    timeZone: "Europe/Paris",
  },
  {
    event: "the Wright brothers' first flight",
    date: "1903-12-17",
    time: "10:35",
    timeZone: "America/New_York",
  },
  {
    event: "Sputnik launched",
    date: "1957-10-04",
    time: "19:28:34",
    timeZone: "UTC",
  },
  {
    event: "the Eiffel Tower opened to the public",
    date: "1889-05-15",
    timeZone: "Europe/Paris",
  },
  {
    event: "the fall of the Western Roman Empire",
    date: "0476-09-05",
    timeZone: "Europe/Rome",
  },
  {
    event: "the sealing of the Magna Carta",
    date: "1215-06-22",
    timeZone: "Europe/London",
  },
  {
    event: "Columbus reached the Americas",
    date: "1492-10-21",
    timeZone: "America/Nassau",
  },
];

export default samples;
