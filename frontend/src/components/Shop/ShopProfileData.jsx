import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiPackage, FiCalendar, FiStar, FiArrowRight } from "react-icons/fi";
import ProductCard from "../Route/ProductCard/ProductCard";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../Products/Ratings";

const tabs = [
  { id: 1, label: "Products", icon: FiPackage },
  { id: 2, label: "Events", icon: FiCalendar },
  { id: 3, label: "Reviews", icon: FiStar },
];

const EmptyState = ({ title, description }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#dfe7dd] bg-white px-6 py-14 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiPackage size={21}/></span>
    <h3 className="mt-4 text-sm font-bold text-[#344238]">{title}</h3>
    <p className="mt-1 max-w-sm text-xs leading-5 text-[#879188]">{description}</p>
  </div>
);

const ShopProfileData = ({ isOwner }) => {
  const { products = [] } = useSelector((state) => state.products);
  const { events = [] } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (!id) return;
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const reviews = useMemo(() => products.flatMap((product) => product.reviews || []), [products]);

  return (
    <section className="min-w-0">
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#8a988d]">Shop collection</p><h2 className="mt-1 font-display text-xl font-extrabold text-[#26372d]">Discover what we offer</h2><p className="mt-1 text-xs text-[#879188]">Browse products, current promotions and customer feedback.</p></div>
        {isOwner && <Link to="/dashboard" className="inline-flex items-center gap-2 self-start rounded-xl bg-[#315c46] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#254b37] sm:self-auto">Open seller studio <FiArrowRight size={14}/></Link>}
      </div>

      <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-[#e6ebe4] bg-white p-2 shadow-[0_5px_24px_rgba(35,52,40,.03)]">
        {tabs.map((tab) => { const Icon = tab.icon; const selected = active === tab.id; return (
          <button key={tab.id} onClick={() => setActive(tab.id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${selected ? "bg-[#315c46] text-white shadow-sm" : "text-[#748177] hover:bg-[#f1f5f0] hover:text-[#315c46]"}`}>
            <Icon size={15}/>{tab.label}<span className={`rounded-full px-2 py-0.5 text-[10px] ${selected ? "bg-white/15 text-white" : "bg-[#f1f4f0] text-[#879188]"}`}>{tab.id === 1 ? products.length : tab.id === 2 ? events.length : reviews.length}</span>
          </button>
        );})}
      </div>

      {active === 1 && (products.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard data={product} key={product._id} isShop={true}/>)}</div> : <EmptyState title="No products listed yet" description={isOwner ? "Add your first product from the seller dashboard to start building your shop." : "This shop has not listed any products yet."}/>)}

      {active === 2 && (events.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{events.map((event) => <ProductCard data={event} key={event._id} isShop={true} isEvent={true}/>)}</div> : <EmptyState title="No active events" description="Promotional events from this shop will appear here when available."/>)}

      {active === 3 && (reviews.length ? <div className="space-y-3">{reviews.map((review, index) => <article key={review._id || index} className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.03)]"><div className="flex items-start gap-3"><img src={review.user?.avatar?.url || "https://placehold.co/80x80?text=U"} alt={review.user?.name || "Customer"} className="h-10 w-10 rounded-full bg-[#edf2ec] object-cover"/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-[#344238]">{review.user?.name || "Customer"}</p><Ratings rating={review.rating}/></div><p className="mt-2 text-sm leading-6 text-[#68756c]">{review.comment || "No written feedback provided."}</p><p className="mt-2 text-[10px] text-[#a0aaa2]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</p></div></div></article>)}</div> : <EmptyState title="No reviews yet" description="Customer feedback and ratings will show here once buyers review products from this shop." />)}
    </section>
  );
};
export default ShopProfileData;
