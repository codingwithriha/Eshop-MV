import React from "react";
import CountDown from "./CountDown";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCalendar, FiShoppingBag, FiTag } from "react-icons/fi";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  const { cart = [] } = useSelector((state) => state.cart || {});

  // Event pages can briefly receive an empty list while data is loading,
  // or have no events at all. Never render a card without an event object.
  if (!data || typeof data !== "object" || !data._id) return null;

  const imageUrl = data.images?.find((image) => image?.url)?.url;
  const hasDiscount = Number(data.originalPrice) > Number(data.discountPrice);

  const addTocartHandler = (product) => {
    const isItemExists = cart.find((item) => item?._id === product._id);
    if (isItemExists) {
      toast.error("Item is already in the cart!");
      return;
    }
    if (Number(product.stock) < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...product, qty: 1 }));
    toast.success("Item added to cart successfully!");
  };

  return (
    <article className={`group grid w-full overflow-hidden rounded-[24px] border border-[#e7ebe5] bg-white shadow-[0_12px_40px_rgba(32,41,35,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(32,41,35,.10)] lg:grid-cols-[1.02fr_1fr] ${active ? "mb-0" : "mb-8"}`}>
      <div className="relative min-h-[280px] overflow-hidden bg-[#f0f3ee] sm:min-h-[380px]">
        {imageUrl ? (
          <img src={imageUrl} alt={data.name || "Event product"} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#849087]">Event image unavailable</div>
        )}
        <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-[#20372a]/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur">Limited-time event</div>
        {hasDiscount && <div className="absolute bottom-5 left-5 rounded-full bg-[#d9bd91] px-4 py-2 text-xs font-extrabold text-[#26372d]">Special offer</div>}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#66806e]"><FiTag size={14}/>{data.category || "Featured event"}</div>
        <h2 className="font-display text-2xl font-extrabold leading-tight tracking-[-.04em] text-[#202923] sm:text-3xl">{data.name || "Featured event"}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#737e76]">{data.description || "Explore this limited-time marketplace offer while it lasts."}</p>

        <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="font-display text-3xl font-extrabold tracking-tight text-[#315c46]">${data.discountPrice ?? "—"}</span>
          {hasDiscount && <span className="pb-1 text-sm text-[#9aa39c] line-through">${data.originalPrice}</span>}
          <span className="ml-auto pb-1 text-xs text-[#879188]">{data.stock ?? 0} available</span>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f6f8f4] p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#728176]"><FiCalendar/> Offer ends in</div>
          <div className="[&>span]:!text-[15px] [&>span]:!font-bold [&>span]:!text-[#315c46]"><CountDown data={data}/></div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link to={`/product/${data._id}?isEvent=true`} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#315c46] px-5 text-sm font-bold text-white transition hover:bg-[#244735]">View event <FiArrowUpRight/></Link>
          <button type="button" onClick={() => addTocartHandler(data)} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#dce5dc] bg-white px-5 text-sm font-bold text-[#315c46] transition hover:border-[#315c46] hover:bg-[#f4f7f2]"><FiShoppingBag/> Add to cart</button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
