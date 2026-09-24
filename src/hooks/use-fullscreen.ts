import { useCallback, useEffect, useState } from "react";

export const isFullscreenSupported =
  typeof document !== "undefined" && document.fullscreenEnabled;

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(() => {
    if (!isFullscreenSupported) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "f" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, [role=dialog]")) return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { isFullscreen, toggle };
};
