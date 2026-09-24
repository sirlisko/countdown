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
import { useState } from "react";
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
  const [link, setLink] = useState<string | undefined>("");

  const form = useForm<CountdownType>({
    mode: "onTouched",
    resolver: zodResolver(Countdown),
    defaultValues: defaultValues ?? {
      message: "",
      filters: [],
      time: "00:00",
      obfuscate: false,
      date: "",
    },
  });
  const { toast } = useToast();
  const { isValid } = form.formState;

  function onSubmit(data: CountdownType) {
    if (isValid && data.date) {
      const qs = createQueryString(data as Countdown);
      setLink(
        `${window.location.origin}/${data.obfuscate ? btoa(qs) : `?${qs}`}`,
      );
    } else {
      setLink(undefined);
    }
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
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
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
        {link && (
          <>
            <div className="flex items-center space-x-2 mt-5">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" value={link} readOnly />
              </div>
              {canShare && (
                <Button
                  type="button"
                  size="sm"
                  className="px-3"
                  onClick={onShare}
                >
                  <span className="sr-only">Share</span>
                  <Share1Icon className="h-4 w-4" />
                </Button>
              )}
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  className="px-3"
                  onClick={onCopy}
                >
                  <span className="sr-only">Copy</span>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </DialogClose>
              <Button size="sm" className="px-3" asChild>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <FormField
              control={form.control}
              name="obfuscate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Obfuscate the link</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
};

export default InputForm;
