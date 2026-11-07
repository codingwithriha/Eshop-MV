import React from "react";
const brands=["dell","hp","Lenovo","SAMSUNG","SONY","ASUS","LG","Apple"];
const Sponsored=()=>(
 <section className="mx-auto my-10 w-full max-w-[1440px] overflow-hidden rounded-[24px] border border-[#e6ece5] bg-white px-5 py-7 shadow-[0_8px_28px_rgba(35,52,40,.035)] sm:px-8">
  <div className="mb-5 flex flex-wrap items-end justify-between gap-2"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#91a096]">Brands you know</p><h2 className="mt-1 font-display text-lg font-extrabold text-[#2d3c32]">Shop trusted names</h2></div><span className="text-xs text-[#89968c]">A few favourites, all in one place</span></div>
  <div className="brand-marquee relative overflow-hidden" aria-label="Featured brands"><div className="brand-track flex w-max items-center gap-5 py-2">{[...brands,...brands].map((brand,i)=><div key={i} className="flex h-[76px] w-[160px] shrink-0 items-center justify-center rounded-2xl border border-[#edf0eb] bg-[#fafbf9] px-5 text-2xl font-black tracking-tight text-[#53645a] transition hover:border-[#d8e3d8] hover:bg-[#f0f5ef]">{brand}</div>)}</div></div>
  <style>{`@keyframes eshop-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.brand-track{animation:eshop-marquee 30s linear infinite}.brand-marquee:hover .brand-track{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.brand-track{animation:none}}`}</style>
 </section>
);
export default Sponsored;