import React from "react";

const brands = [
  { name: "Dell", descriptor: "Technology", style: "font-black tracking-[-.08em] text-[34px]" },
  { name: "hp", descriptor: "Computing", style: "font-black italic tracking-[-.08em] text-[42px]" },
  { name: "SONY", descriptor: "Electronics", style: "font-black tracking-[.04em] text-[27px]" },
  { name: "Lenovo", descriptor: "Smart devices", style: "font-extrabold tracking-[-.06em] text-[29px]" },
  { name: "Apple", descriptor: "Personal technology", style: "font-semibold tracking-[-.05em] text-[30px]" },
  { name: "SAMSUNG", descriptor: "Digital lifestyle", style: "font-extrabold tracking-[-.04em] text-[22px]" },
  { name: "ASUS", descriptor: "Performance", style: "font-black italic tracking-[-.04em] text-[30px]" },
];

const BrandCard = ({ brand }) => (
  <div className="group flex h-[112px] w-[190px] shrink-0 flex-col items-center justify-center rounded-2xl border border-[#e9eee7] bg-white px-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#cbd9ca] hover:shadow-[0_12px_28px_rgba(38,55,45,.08)] sm:w-[205px]">
    <span className={`leading-none text-[#304f3d] transition-colors group-hover:text-[#9a8058] ${brand.style}`}>{brand.name}</span>
    <span className="mt-3 text-[9px] font-bold uppercase tracking-[.18em] text-[#a0aaa1]">{brand.descriptor}</span>
  </div>
);

const Sponsored = () => (
  <section className="mx-auto my-16 w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-[30px] border border-[#e8ede6] bg-[#f8faf7] py-8 shadow-[0_16px_44px_rgba(36,55,42,.045)] sm:py-10">
      <div className="mx-auto mb-7 flex max-w-5xl flex-col items-center px-6 text-center sm:mb-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e9df] bg-white px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[.2em] text-[#8b795a]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b89a69]" /> The brands you know
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-.04em] text-[#26372d] sm:text-[32px]">Good brands. Great finds.</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#87938a]">Discover trusted names in technology, electronics and everyday essentials.</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f8faf7] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f8faf7] to-transparent sm:w-20" />
        <div className="eshop-brand-marquee">
          <div className="eshop-brand-track flex w-max gap-3 px-3 sm:gap-4 sm:px-4">
            {[...brands, ...brands].map((brand, index) => <BrandCard key={`${brand.name}-${index}`} brand={brand} />)}
          </div>
        </div>
      </div>
      <div className="mt-7 flex items-center justify-center gap-3 px-5 text-[9px] font-bold uppercase tracking-[.19em] text-[#a0aaa1]">
        <span className="h-px w-8 bg-[#dce5da]" /> Explore popular brands <span className="h-px w-8 bg-[#dce5da]" />
      </div>
    </div>
    <style>{`@keyframes eshop-brand-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}.eshop-brand-track{animation:eshop-brand-scroll 42s linear infinite}.eshop-brand-marquee:hover .eshop-brand-track{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.eshop-brand-track{animation:none}}`}</style>
  </section>
);

export default Sponsored;
