import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import CountdownPage from "./components/CountdownPage";

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <CountdownPage />
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-40 opacity-[0.08] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen"
    />
    <Toaster />
  </ThemeProvider>
);

export default App;
