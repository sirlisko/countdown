import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";
// biome-ignore lint/correctness/noUnusedImports: classic JSX runtime on Deno needs React in scope
import React from "https://esm.sh/react@18.2.0";
import type { Config } from "@netlify/edge-functions";
import { formatTarget, readSharedCountdown } from "../lib/countdown.ts";

const BG = "#0a0a0a";
const FG = "#efeee9";
const SIGNAL_FUTURE = "#c8ff00";
const SIGNAL_PAST = "#ff4d00";

let fonts: Promise<ArrayBuffer[]> | undefined;
const loadFonts = (origin: string) =>
  (fonts ??= Promise.all(
    ["space-grotesk-700.ttf", "jetbrains-mono-700.ttf"].map((file) =>
      fetch(new URL(`/og/${file}`, origin)).then((res) => res.arrayBuffer()),
    ),
  ));

const sizeFor = (message: string) => {
  if (message.length <= 24) return 128;
  if (message.length <= 60) return 84;
  return 60;
};

const truncate = (message: string, max = 110) =>
  message.length > max ? `${message.slice(0, max - 1)}…` : message;

export default async (request: Request) => {
  const url = new URL(request.url);
  const countdown = readSharedCountdown(url.searchParams);
  const [grotesk, mono] = await loadFonts(url.origin);

  const isPast = countdown ? countdown.target.getTime() <= Date.now() : false;
  const signal = isPast ? SIGNAL_PAST : SIGNAL_FUTURE;
  const headline = truncate(countdown?.message ?? "How much time left?");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        color: FG,
        fontFamily: "Space Grotesk",
      }}
    >
      <div
        style={{
          height: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          borderBottom: `4px solid ${FG}`,
          fontFamily: "JetBrains Mono",
          fontSize: 24,
          letterSpacing: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              background: signal,
              border: `4px solid ${FG}`,
            }}
          />
          COUNTDOWN
        </div>
        {countdown && (
          <div
            style={{
              display: "flex",
              background: signal,
              color: BG,
              padding: "6px 14px",
            }}
          >
            {isPast ? "T-PLUS" : "T-MINUS"}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
        }}
      >
        <div
          style={{
            fontSize: sizeFor(headline),
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </div>
      </div>
      <div
        style={{
          height: 112,
          display: "flex",
          alignItems: "stretch",
          borderTop: `4px solid ${FG}`,
          fontFamily: "JetBrains Mono",
          fontSize: 32,
          letterSpacing: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            background: FG,
            color: BG,
          }}
        >
          T-0
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
          }}
        >
          {countdown ? formatTarget(countdown) : "COUNTDOWN.SIRLISKO.COM"}
        </div>
        <div
          style={{
            width: 112,
            background: signal,
            borderLeft: `4px solid ${FG}`,
          }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Space Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 700, style: "normal" },
      ],
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
};

export const config: Config = { path: "/og" };
