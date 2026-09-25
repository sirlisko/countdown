import "@testing-library/jest-dom/vitest";

// jsdom has no layout, but Radix primitives observe element sizes
if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
