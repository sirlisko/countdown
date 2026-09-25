import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { lazy, memo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Countdown } from "@/types";

const loadInputForm = () => import("./InputForm");
const InputForm = lazy(loadInputForm);

const Bar = ({ className }: { className: string }) => (
  <div className={`bg-muted ${className}`} />
);

const CheckboxRow = () => (
  <div className="flex gap-3">
    <Bar className="size-4 shrink-0" />
    <div className="flex-1 space-y-2">
      <Bar className="h-3.5 w-2/5" />
      <Bar className="h-3 w-full" />
      <Bar className="h-3 w-3/5" />
    </div>
  </div>
);

// Mirrors the form's layout so the dialog doesn't jump in height once it loads
const InputFormSkeleton = () => (
  <div aria-hidden className="space-y-6 motion-safe:animate-pulse">
    <div className="space-y-2">
      <Bar className="h-3.5 w-16" />
      <Bar className="h-9 w-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2">
          <Bar className="h-3.5 w-10" />
          <Bar className="h-9 w-full" />
        </div>
      ))}
    </div>
    <CheckboxRow />
    <CheckboxRow />
    <div className="space-y-2">
      <Bar className="h-3.5 w-24" />
      <Bar className="h-3 w-3/5" />
      <div className="flex gap-4 pt-4">
        {[0, 1, 2].map((i) => (
          <Bar key={i} className="h-4 w-16" />
        ))}
      </div>
    </div>
    <CheckboxRow />
    <CheckboxRow />
    <Bar className="h-11 w-full" />
  </div>
);

export interface DialogState {
  open: boolean;
  isEdit: boolean;
}

const DialogNew = memo(
  ({
    defaultValues,
    triggerClassName,
    state: { open, isEdit },
    onStateChange,
  }: {
    defaultValues?: Countdown;
    triggerClassName?: string;
    state: DialogState;
    onStateChange: (state: DialogState) => void;
  }) => (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onStateChange({ open, isEdit })}
    >
      {defaultValues && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={triggerClassName}
            onClick={() => onStateChange({ open: true, isEdit: true })}
            onPointerEnter={loadInputForm}
            onFocus={loadInputForm}
          >
            <Pencil1Icon className="size-4" />
            <span className="sr-only sm:not-sr-only">Edit</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={triggerClassName}
          onClick={() => onStateChange({ open: true, isEdit: false })}
          onPointerEnter={loadInputForm}
          onFocus={loadInputForm}
        >
          <PlusIcon className="size-4" />
          <span className="sr-only sm:not-sr-only">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? "Edit countdown" : "New countdown"}
          </DialogTitle>
          <DialogDescription hidden>
            Make your personalised countdown
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<InputFormSkeleton />}>
          <div className="fade-in-0 motion-safe:animate-in">
            <InputForm defaultValues={isEdit ? defaultValues : undefined} />
          </div>
        </Suspense>
      </DialogContent>
    </Dialog>
  ),
);

export default DialogNew;
