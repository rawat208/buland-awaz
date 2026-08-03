const ITEMS = [
  "Child rights",
  "Education for all",
  "End child labour",
  "Stop child marriage",
  "Women's dignity",
  "Community first",
];

export const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      data-testid="editorial-marquee"
      className="overflow-hidden border-b-2 border-ink bg-brand-yellow py-4"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center font-display text-xl font-semibold uppercase tracking-tight text-ink md:text-3xl"
              >
                <span className="px-6">{item}</span>
                <span className="text-brand-red">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
