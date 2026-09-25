export interface Sample {
  event: string;
  date: string;
  time?: string;
  // Omitted for moments that belong to the viewer, like their own New Year
  timeZone?: string;
  filters?: string[];
  link?: string;
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
    link: "https://en.wikipedia.org/wiki/Year_2000_problem",
  },
  {
    event: "the start of the Anno Domini era",
    date: "0001-01-01",
    filters: ["m", "s", "h"],
    link: "https://en.wikipedia.org/wiki/Anno_Domini",
  },
  {
    event: "the Year 2038 problem",
    date: "2038-01-19",
    time: "03:14:08",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Year_2038_problem",
  },
  {
    event: "Unix time 2,000,000,000",
    date: "2033-05-18",
    time: "03:33:20",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Unix_time",
  },
  {
    event: "the 2027 total solar eclipse",
    date: "2027-08-02",
    time: "10:07",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Solar_eclipse_of_August_2,_2027",
  },
  {
    event: "the LA 2028 Olympics opening",
    date: "2028-07-14",
    timeZone: "America/Los_Angeles",
    link: "https://en.wikipedia.org/wiki/2028_Summer_Olympics",
  },
  {
    event: "the return of Halley's Comet",
    date: "2061-07-28",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Halley%27s_Comet",
  },
  {
    event: "the Moon landing",
    date: "1969-07-20",
    time: "20:17",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Apollo_11",
  },
  {
    event: "Marty McFly came back to the future",
    date: "1985-10-26",
    time: "01:24",
    timeZone: "America/Los_Angeles",
    link: "https://en.wikipedia.org/wiki/Back_to_the_Future",
  },
  {
    event: "the Titanic sank",
    date: "1912-04-15",
    time: "05:20",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Sinking_of_the_Titanic",
  },
  {
    event: "the first website went live",
    date: "1990-12-20",
    timeZone: "Europe/Zurich",
    link: "https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web",
  },
  {
    event: "the Berlin Wall opened",
    date: "1989-11-09",
    time: "23:30",
    timeZone: "Europe/Berlin",
    link: "https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall",
  },
  {
    event: "Star Wars hit cinemas",
    date: "1977-05-25",
    timeZone: "America/Los_Angeles",
    link: "https://en.wikipedia.org/wiki/Star_Wars_(film)",
  },
  {
    event: "Woodstock began",
    date: "1969-08-15",
    time: "17:07",
    timeZone: "America/New_York",
    link: "https://en.wikipedia.org/wiki/Woodstock",
  },
  {
    event: "the storming of the Bastille",
    date: "1789-07-14",
    timeZone: "Europe/Paris",
    link: "https://en.wikipedia.org/wiki/Storming_of_the_Bastille",
  },
  {
    event: "the Wright brothers' first flight",
    date: "1903-12-17",
    time: "10:35",
    timeZone: "America/New_York",
    link: "https://en.wikipedia.org/wiki/Wright_Flyer",
  },
  {
    event: "Sputnik launched",
    date: "1957-10-04",
    time: "19:28:34",
    timeZone: "UTC",
    link: "https://en.wikipedia.org/wiki/Sputnik_1",
  },
  {
    event: "the Eiffel Tower opened to the public",
    date: "1889-05-15",
    timeZone: "Europe/Paris",
    link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
  },
  {
    event: "the fall of the Western Roman Empire",
    date: "0476-09-05",
    timeZone: "Europe/Rome",
    link: "https://en.wikipedia.org/wiki/Fall_of_the_Western_Roman_Empire",
  },
  {
    event: "the sealing of the Magna Carta",
    date: "1215-06-22",
    timeZone: "Europe/London",
    link: "https://en.wikipedia.org/wiki/Magna_Carta",
  },
  {
    event: "Columbus reached the Americas",
    date: "1492-10-21",
    timeZone: "America/Nassau",
    link: "https://en.wikipedia.org/wiki/Voyages_of_Christopher_Columbus",
  },
];

export default samples;
