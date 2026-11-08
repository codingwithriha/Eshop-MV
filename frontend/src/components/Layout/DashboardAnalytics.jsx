import React from "react";

const money = (value) => "$" + Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

const buildMonthly = (orders = []) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { key: date.getFullYear() + "-" + date.getMonth(), label: date.toLocaleString("en-US", { month: "short" }), value: 0 };
  });
  const indexByKey = Object.fromEntries(months.map((month, index) => [month.key, index]));
  orders.forEach((order) => {
    const date = order?.createdAt ? new Date(order.createdAt) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const index = indexByKey[date.getFullYear() + "-" + date.getMonth()];
    if (index !== undefined) months[index].value += Number(order?.totalPrice || 0);
  });
  return months;
};

const Donut = ({ orders = [] }) => {
  const statuses = [
    { label: "Delivered", color: "#315c46" },
    { label: "Processing", color: "#b58a5a" },
    { label: "Shipped", color: "#829b8a" },
    { label: "Other", color: "#d9dfd8" },
  ].map((item) => ({ ...item, value: orders.filter((order) => {
    const status = String(order?.status || "").toLowerCase();
    return item.label === "Other" ? !["delivered", "processing", "shipped"].includes(status) : status === item.label.toLowerCase();
  }).length }));
  const total = statuses.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="43" fill="none" stroke="#edf1ec" strokeWidth="14" />
          {total > 0 && statuses.filter(item => item.value > 0).map((item) => {
            const length = (item.value / total) * 270;
            const current = offset;
            offset += length;
            return <circle key={item.label} cx="60" cy="60" r="43" fill="none" stroke={item.color} strokeWidth="14" strokeDasharray={length + " " + (270 - length)} strokeDashoffset={-current} strokeLinecap="butt" />;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="font-display text-2xl text-[#26372d]">{total}</strong><span className="text-[10px] text-[#89958b]">Orders</span></div>
      </div>
      <div className="w-full space-y-3 sm:max-w-[190px]">
        {statuses.map((item) => <div key={item.label} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-[#748177]"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><strong className="text-[#344238]">{item.value}</strong></div>)}
        {total === 0 && <p className="text-[11px] leading-5 text-[#89958b]">Order status breakdown will appear here when orders are available.</p>}
      </div>
    </div>
  );
};

const DashboardAnalytics = ({ orders = [], heading = "Sales performance" }) => {
  const monthly = buildMonthly(orders);
  const max = Math.max(...monthly.map((item) => item.value), 1);
  const points = monthly.map((item, index) => {
    const x = 30 + index * 62;
    const y = 132 - (item.value / max) * 100;
    return { ...item, x, y };
  });
  const path = points.map((point, index) => (index ? "L" : "M") + point.x + " " + point.y).join(" ");
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order?.totalPrice || 0), 0);

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <article className="min-w-0 rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
          <div><h2 className="font-display text-lg font-extrabold text-[#26372d]">{heading}</h2><p className="mt-1 text-xs text-[#879188]">Monthly order value · last six months</p></div>
          <div className="rounded-xl bg-[#edf2ec] px-3 py-2"><p className="text-[10px] font-semibold text-[#78867b]">Order value total</p><p className="mt-0.5 text-sm font-extrabold text-[#315c46]">{money(totalRevenue)}</p></div>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 370 165" role="img" aria-label="Monthly order value line chart" className="h-auto w-full">
            {[32, 82, 132].map(y => <line key={y} x1="22" x2="352" y1={y} y2={y} stroke="#edf1ec" strokeDasharray="4 5" />)}
            {points.length > 1 && <path d={path + " L " + points[points.length - 1].x + " 132 L " + points[0].x + " 132 Z"} fill="#edf2ec" />}
            {points.length > 1 && <path d={path} fill="none" stroke="#315c46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {points.map(point => <g key={point.key}><circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#315c46" strokeWidth="2.5" /><text x={point.x} y="154" textAnchor="middle" fontSize="10" fill="#879188">{point.label}</text></g>)}
          </svg>
        </div>
        {orders.length === 0 && <p className="mt-1 text-center text-[11px] text-[#89958b]">No orders yet. Your chart will update as sales come in.</p>}
      </article>
      <article className="rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-6">
        <div className="mb-5"><h2 className="font-display text-lg font-extrabold text-[#26372d]">Order overview</h2><p className="mt-1 text-xs text-[#879188]">Current order status breakdown</p></div>
        <Donut orders={orders} />
      </article>
    </section>
  );
};

export default DashboardAnalytics;
