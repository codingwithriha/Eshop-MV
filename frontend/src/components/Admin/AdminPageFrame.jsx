import React from "react";
import { FiActivity } from "react-icons/fi";

const AdminPageFrame = ({ eyebrow = "ADMINISTRATION", title, description, icon: Icon = FiActivity, stats = [], children }) => (
  <main className="min-w-0 flex-1 bg-[#f6f8f5] px-4 py-7 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#89968c]">{eyebrow}</p><div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e9] text-[#315c46]"><Icon size={21}/></span><div><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#26372d] sm:text-3xl">{title}</h1><p className="mt-1 text-xs text-[#7e8a80] sm:text-sm">{description}</p></div></div></div>
      </div>
      {stats.length > 0 && <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-[#e5ebe3] bg-white p-4 shadow-[0_4px_18px_rgba(35,52,40,.035)]"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#929d94]">{stat.label}</p><p className="mt-2 text-2xl font-extrabold tracking-tight text-[#304437]">{stat.value}</p>{stat.note && <p className="mt-1 text-[10px] text-[#929d94]">{stat.note}</p>}</div>)}</div>}
      <section className="overflow-hidden rounded-2xl border border-[#e5ebe3] bg-white shadow-[0_5px_24px_rgba(35,52,40,.04)]">{children}</section>
    </div>
  </main>
);
export default AdminPageFrame;
