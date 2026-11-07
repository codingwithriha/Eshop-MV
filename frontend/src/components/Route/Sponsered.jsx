import React from "react";

const brands = [
  { name: "Dell", label: "Technology", wordmark: "text-[34px] font-black tracking-[-.09em]" },
  { name: "hp", label: "Computing", wordmark: "text-[43px] font-black italic tracking-[-.1em]" },
  { name: "SONY", label: "Electronics", wordmark: "text-[27px] font-black tracking-[.04em]" },
  { name: "Lenovo", label: "Smart devices", wordmark: "text-[29px] font-extrabold tracking-[-.06em]" },
  { name: "Apple", label: "Personal tech", wordmark: "text-[30px] font-semibold tracking-[-.06em]" },
];

const Sponsered = () => (
  <section className="mx-auto my-14 w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-[28px] border border-[#e7ece5] bg-white shadow-[0_14px_40px_rgba(36,55,42,.055)]">
      <div className="flex flex-col items-center px-5 pb-6 pt-8 text-center sm:pt-9">
        <span className="text-[9px] font-extrabold uppercase tracking-[.24em] text-[#a0875e]">Shop your favourites</span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.04em] text-[#26372d] sm:text-[30px]">Popular brands, all in one place.</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-[#87938a]">Find products from the names you already know and trust.</p>
      </div>
      <div className="relative overflow-hidden border-y border-[#edf1eb] bg-[#fafbf9] py-5 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#fafbf9] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#fafbf9] to-transparent sm:w-20" />
        <div className="eshop-home-brand-marquee">
          <div className="eshop-home-brand-track flex w-max items-center gap-3 px-3 sm:gap-4 sm:px-5">
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand.name}-${index}`} className="group flex h-[104px] w-[180px] shrink-0 flex-col items-center justify-center rounded-2xl border border-[#e8ede6] bg-white px-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#cbd9ca] hover:shadow-[0_10px_24px_rgba(38,55,45,.07)] sm:w-[205px]">
                <span className={`leading-none text-[#315c46] transition-colors group-hover:text-[#9a8058] ${brand.wordmark}`}>{brand.name}</span>
                <span className="mt-3 text-[9px] font-bold uppercase tracking-[.17em] text-[#a0aaa1]">{brand.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 px-4 py-4 text-[9px] font-bold uppercase tracking-[.18em] text-[#9aa69d]">
        <span className="h-px w-7 bg-[#dce5da]" /> Discover more from top brands <span className="h-px w-7 bg-[#dce5da]" />
      </div>
    </div>
    <style>{`@keyframes eshop-home-brand-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}.eshop-home-brand-track{animation:eshop-home-brand-scroll 36s linear infinite}.eshop-home-brand-marquee:hover .eshop-home-brand-track{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.eshop-home-brand-track{animation:none}}`}</style>
  </section>
);

export default Sponsered;
