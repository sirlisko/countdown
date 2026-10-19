const SIGNAL = { future: "#c8ff00", past: "#ff4d00" };

// Same mark as public/favicon.svg, with the square in the phase's signal colour
const icon = (signal: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0a0a0a"/><rect x="8" y="8" width="16" height="16" fill="${signal}"/><path d="M16 10.5V16.5L20.5 12" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="square" fill="none"/></svg>`;

export const setPhaseFavicon = (phase: keyof typeof SIGNAL) =>
  document
    .querySelector('link[rel="icon"]')
    ?.setAttribute(
      "href",
      `data:image/svg+xml,${encodeURIComponent(icon(SIGNAL[phase]))}`,
    );
