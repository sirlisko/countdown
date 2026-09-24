// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "@/components/ui/dialog";
import InputForm from "../InputForm";
import type { Countdown } from "@/types";

const renderForm = (defaultValues?: Countdown) =>
  render(
    <Dialog open>
      <InputForm defaultValues={defaultValues} />
    </Dialog>,
  );

const link = () =>
  new URL(screen.getByLabelText<HTMLInputElement>("Link").value);

const pickDate = (value: string) =>
  fireEvent.change(screen.getByLabelText("Date"), { target: { value } });

describe("InputForm", () => {
  it("should ask for a date before generating", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );
    expect(await screen.findByText("Pick a date")).toBeInTheDocument();
    expect(screen.queryByLabelText("Link")).not.toBeInTheDocument();
  });

  it("should create a same-moment link by default", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText("Message"), "Launch");
    pickDate("2030-01-01");
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );

    const params = link().searchParams;
    expect(params.get("m")).toBe("Launch");
    expect(params.get("z")).toBe(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    expect(params.get("t")).toMatch(/Z$/);
  });

  it("should add the optional parts only when asked", async () => {
    renderForm();
    pickDate("2030-01-01");
    await userEvent.click(screen.getByLabelText("Same moment everywhere"));
    await userEvent.click(screen.getByLabelText("Repeat every year"));
    await userEvent.click(screen.getByLabelText("Progress bar"));
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );

    const params = link().searchParams;
    expect(params.get("t")).toBe("2030-01-01T00:00:00.000Z");
    expect(params.has("z")).toBe(false);
    expect(params.get("r")).toBe("y");
    expect(params.has("c")).toBe(true);
  });

  it("should hide the details when asked", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText("Message"), "Secret");
    pickDate("2030-01-01");
    await userEvent.click(screen.getByLabelText("Hide details from the URL"));
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );

    expect(link().search).toBe("");
    expect(atob(link().pathname.slice(1))).toContain("m=Secret");
  });

  it("should clear the link once something changes", async () => {
    renderForm();
    pickDate("2030-01-01");
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );
    expect(screen.getByLabelText("Link")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Message"), "x");
    await waitFor(() =>
      expect(screen.queryByLabelText("Link")).not.toBeInTheDocument(),
    );
  });

  it("should keep the original start and zone when editing", async () => {
    renderForm({
      message: "Launch",
      date: "2030-01-01",
      time: "09:00",
      filters: [],
      progress: true,
      created: "2029-01-01T00:00:00.000Z",
      sameMoment: true,
      timeZone: "Asia/Tokyo",
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Generate link" }),
    );

    const params = link().searchParams;
    expect(params.get("c")).toBe("2029-01-01T00:00:00.000Z");
    expect(params.get("z")).toBe("Asia/Tokyo");
    expect(params.get("t")).toBe("2030-01-01T00:00:00.000Z");
  });
});
