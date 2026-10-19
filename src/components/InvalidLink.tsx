const InvalidLink = ({ onCreate }: { onCreate: () => void }) => (
  <section className="flex flex-col gap-6">
    <p className="font-mono text-xs uppercase tracking-widest">
      <span className="bg-destructive px-1.5 py-0.5 text-destructive-foreground">
        Err
      </span>{" "}
      This link doesn't hold a valid date
    </p>
    <h1 className="text-[clamp(3rem,12vw,12rem)] font-bold uppercase leading-[0.8] tracking-tighter">
      Invalid
      <br />
      date.
    </h1>
    <button
      type="button"
      onClick={onCreate}
      className="self-start font-mono text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 hover:bg-foreground hover:text-background"
    >
      Make your own →
    </button>
  </section>
);

export default InvalidLink;
