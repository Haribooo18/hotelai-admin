"use client";

type Props = {
  active: string;
  setActive: (status: string) => void;

  counts: {
    all: number;
    new: number;
    contacted: number;
    confirmed: number;
    cancelled: number;
  };
};

export function LeadFilters({
  active,
  setActive,
  counts,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <Filter
        active={active === "all"}
        onClick={() => setActive("all")}
      >
        All ({counts.all})
      </Filter>

      <Filter
        active={active === "new"}
        onClick={() => setActive("new")}
      >
        New ({counts.new})
      </Filter>

      <Filter
        active={active === "contacted"}
        onClick={() => setActive("contacted")}
      >
        Contacted ({counts.contacted})
      </Filter>

      <Filter
        active={active === "confirmed"}
        onClick={() => setActive("confirmed")}
      >
        Confirmed ({counts.confirmed})
      </Filter>

      <Filter
        active={active === "cancelled"}
        onClick={() => setActive("cancelled")}
      >
        Cancelled ({counts.cancelled})
      </Filter>
    </div>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm transition-all ${
        active
          ? "bg-emerald-600 text-white shadow"
          : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}