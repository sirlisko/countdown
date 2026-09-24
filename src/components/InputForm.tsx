import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { CopyIcon, ExternalLinkIcon, Share1Icon } from "@radix-ui/react-icons";
import { createQueryString } from "@/utils/queryString";
import { getBrowserTimeZone } from "@/utils/timezone";
import { useEffect, useState } from "react";
import { Countdown } from "@/types";
import type { Countdown as CountdownType } from "@/types";
import { DialogClose } from "./ui/dialog";

const filters = [
  {
    id: "h",
    label: "Hours",
  },
  {
    id: "m",
    label: "Minutes",
  },
  {
    id: "s",
    label: "Seconds",
  },
] as const;

const canShare = typeof navigator !== "undefined" && "share" in navigator;

const InputForm = ({ defaultValues }: { defaultValues?: Countdown }) => {
  const [link, setLink] = useState<string>();

  const form = useForm<CountdownType>({
    mode: "onTouched",
    resolver: zodResolver(Countdown),
    defaultValues: defaultValues ?? {
      message: "",
      filters: [],
      time: "00:00",
      obfuscate: false,
      progress: false,
      sameMoment: true,
      yearly: false,
      date: "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    const subscription = form.watch(() => setLink(undefined));
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: CountdownType) {
    const qs = createQueryString({
      ...data,
      // Editing keeps the original start so the bar doesn't reset
      created: data.created ?? new Date().toISOString(),
    });
    setLink(
      `${window.location.origin}/${data.obfuscate ? btoa(qs) : `?${qs}`}`,
    );
  }

  function onCopy() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({
      description: "Countdown copied to clipboard",
    });
  }

  function onShare() {
    if (!link) return;
    navigator
      .share({
        url: link,
        title: `${form.getValues("message")} Countdown`,
      })
      .catch(() => {});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input placeholder="Enter your message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    className="flex flex-col justify-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    className="flex flex-col justify-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="sameMoment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-2">
                <FormLabel>Same moment everywhere</FormLabel>
                <FormDescription>
                  {field.value
                    ? `Everyone hits zero together, at this time in ${(
                        form.getValues("timeZone") ?? getBrowserTimeZone()
                      ).replace(/_/g, " ")}.`
                    : "Hits zero at this local time wherever each viewer is, like New Year's Eve."}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-2">
                <FormLabel>Repeat every year</FormLabel>
                <FormDescription>
                  Rolls over to next year once it hits zero. Made for birthdays
                  and anniversaries.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filters"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Extra totals</FormLabel>
                <FormDescription>
                  Optional, shown below the main countdown.
                </FormDescription>
              </div>
              <div className="flex space-x-4">
                {filters.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="filters"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel>{item.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-2">
                <FormLabel>Progress bar</FormLabel>
                <FormDescription>
                  Fills up from the moment you share it until the target.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="obfuscate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-2">
                <FormLabel>Hide details from the URL</FormLabel>
                <FormDescription>
                  Scrambles the link so the message isn't readable at a glance.
                  Not encryption: anyone can decode it.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {link ? (
          <div className="flex items-center gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={link} readOnly className="flex-1" />
            {canShare && (
              <Button type="button" size="icon" onClick={onShare}>
                <span className="sr-only">Share</span>
                <Share1Icon className="size-4" />
              </Button>
            )}
            <DialogClose asChild>
              <Button type="button" size="icon" onClick={onCopy}>
                <span className="sr-only">Copy</span>
                <CopyIcon className="size-4" />
              </Button>
            </DialogClose>
            <Button size="icon" asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Open</span>
                <ExternalLinkIcon className="size-4" />
              </a>
            </Button>
          </div>
        ) : (
          <Button type="submit" className="h-11 w-full">
            Generate link
          </Button>
        )}
      </form>
    </Form>
  );
};

export default InputForm;
