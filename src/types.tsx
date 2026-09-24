import { z } from "zod";

export const Countdown = z.object({
  message: z.string().optional(),
  date: z.string().optional(),
  time: z.string(),
  filters: z.array(z.string()),
  obfuscate: z.boolean().optional(),
  progress: z.boolean().optional(),
  created: z.string().optional(),
});

export type Countdown = z.infer<typeof Countdown>;

export interface CountdownFromString {
  from: Date;
  to: Date;
  filters: string[];
  isInverted?: boolean;
  progress?: { start: Date; end: Date; now: Date };
}
