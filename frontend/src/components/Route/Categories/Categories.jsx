import React from "react";
import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section className="store-section py-10 md:py-14">
      <div className="mb-10 grid grid-cols-1 gap-4 rounded-[22px] border border-[#e7ebe5] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
        {brandingData?.map((item,index)=>(
          <div className="flex items-center gap-4 px-2 py-2" key={item.id||index}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf2ec] text-[#315c46]">{item.icon}</div>
            <div><h3 className="font-display text-sm font-bold text-[#26352b]">{item.title}</h3><p className="mt-1 text-xs leading-5 text-[#78837b]">{item.description}</p></div>
          </div>
        ))}
      </div>

      <div id="categories" className="rounded-[24px] border border-[#e7ebe5] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><span className="store-eyebrow">Browse by interest</span><h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#202923] sm:text-3xl">Explore categories</h2><p className="mt-2 text-sm text-[#78837b]">A good find is just a category away.</p></div>
          <span className="hidden text-xs font-semibold text-[#829087] sm:block">{categoriesData?.length || 0} collections</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoriesData?.map((item)=>(
            <button type="button" key={item.id} onClick={()=>navigate(`/products?category=${item.title}`)} className="group flex min-h-[116px] items-center justify-between overflow-hidden rounded-[17px] border border-[#edf0eb] bg-[#f8f9f6] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[#d7e1d6] hover:bg-[#f0f4ef] hover:shadow-[0_12px_28px_rgba(34,55,42,.07)]">
              <span className="max-w-[55%] font-display text-[15px] font-bold leading-5 text-[#334238]">{item.title}<span className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#718276]">Explore <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span></span>
              <img src={item.imageUrl || item.image_Url || item.image_Url?.url} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/240x180/f0f3ee/315c46?text=${encodeURIComponent(item.title)}`; }} alt={item.title} loading="lazy" className="h-[88px] w-[104px] object-contain transition duration-500 group-hover:scale-110"/>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;
