import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { scrubAnalytics } from "./utils/analytics";

declare global {
  interface Window {
    umamiBeforeSend?: (
      type: string,
      payload: Parameters<typeof scrubAnalytics>[0],
    ) => ReturnType<typeof scrubAnalytics>;
  }
}

// Umami calls this by name, from data-before-send, before every request
window.umamiBeforeSend = (_type, payload) => scrubAnalytics(payload);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
