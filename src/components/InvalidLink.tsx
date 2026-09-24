const InvalidLink = () => (
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
    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
      Hit “New” to make your own.
    </p>
  </section>
);

export default InvalidLink;
