import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { lazy, memo, Suspense, useState } from "react";
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

const DialogNew = memo(
  ({
    defaultValues,
    triggerClassName,
  }: {
    defaultValues?: Countdown;
    triggerClassName?: string;
  }) => {
    const [isEdit, setIsEdit] = useState(false);
    return (
      <Dialog>
        {defaultValues && (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={triggerClassName}
              onClick={() => setIsEdit(true)}
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
            onClick={() => setIsEdit(false)}
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
          <Suspense>
            <InputForm defaultValues={isEdit ? defaultValues : undefined} />
          </Suspense>
        </DialogContent>
      </Dialog>
    );
  },
);

export default DialogNew;
