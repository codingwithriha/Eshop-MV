import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#e9eee7]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17251d]/90 via-[#17251d]/65 to-[#17251d]/10" />
      </div>

      <div className="store-section relative z-10 flex min-h-[590px] items-center py-20 md:min-h-[650px]">
        <div className="max-w-[650px] text-white">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[.14em] text-white backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#d5a56c]" />
            ONE MARKETPLACE. MANY GREAT FINDS.
          </div>

          <h1 className="font-display text-[42px] font-extrabold leading-[1.08] tracking-[-.055em] sm:text-[58px] lg:text-[70px]">
            Find your next
            <span className="block text-[#d9bd91]">favourite thing.</span>
          </h1>

          <p className="mt-6 max-w-[510px] text-[15px] leading-7 text-white/80 sm:text-[17px]">
            Explore thoughtfully selected products from independent sellers.
            Discover something useful, something beautiful, or something
            you didn't know you needed.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex h-13 min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#d9bd91] px-7 text-sm font-bold text-[#26372d] transition hover:-translate-y-0.5 hover:bg-[#e7cda5]"
            >
              Explore the collection <FiArrowRight size={18} />
            </Link>
            <Link
              to="/best-selling"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/45 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Discover best sellers
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/20 pt-6 text-xs font-medium text-white/80 sm:text-sm">
            <span className="inline-flex items-center gap-2"><FiCheck className="text-[#d9bd91]" /> Independent sellers</span>
            <span className="inline-flex items-center gap-2"><FiCheck className="text-[#d9bd91]" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><FiCheck className="text-[#d9bd91]" /> Order tracking</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border border-white/20" />
      <div className="pointer-events-none absolute -bottom-12 -right-8 h-52 w-52 rounded-full border border-white/20" />
    </section>
  );
};

export default Hero;
