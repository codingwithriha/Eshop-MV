import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiPhone, FiCalendar, FiPackage, FiStar, FiEdit3, FiArrowUpRight, FiShield } from "react-icons/fi";
import Loader from "../Layout/Loader";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(getAllProductsShop(id));
    let mounted = true;
    setIsLoading(true);
    axios.get(server + "/shop/get-shop-info/" + id)
      .then((response) => { if (mounted) setData(response.data?.shop || {}); })
      .catch(() => { if (mounted) setData({}); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [dispatch, id]);

  const reviews = useMemo(() => (products || []).flatMap((product) => product.reviews || []), [products]);
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
  const joinedDate = data?.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—";

  if (isLoading) return <div className="flex min-h-[420px] items-center justify-center"><Loader /></div>;

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_8px_30px_rgba(35,52,40,.06)]">
      <div className="h-24 bg-[linear-gradient(120deg,#294c39,#52765d_58%,#b18a60)]" />
      <div className="px-5 pb-6">
        <div className="-mt-14 flex items-end justify-between gap-3">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#edf2ec] shadow-sm">
            {data.avatar?.url ? <img src={data.avatar.url} alt={data.name || "Shop"} className="h-full w-full object-cover"/> : <span className="font-display text-3xl font-extrabold text-[#315c46]">{(data.name || "S").charAt(0).toUpperCase()}</span>}
          </div>
          {isOwner && <Link to="/settings" className="mb-1 inline-flex items-center gap-2 rounded-xl border border-[#dfe8de] bg-white px-3 py-2 text-xs font-bold text-[#315c46] transition hover:bg-[#f3f7f2]"><FiEdit3 size={14}/> Edit shop</Link>}
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-xl font-extrabold tracking-tight text-[#26372d]">{data.name || "Your shop"}</h1><span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ed] px-2.5 py-1 text-[10px] font-bold text-[#315c46]"><FiShield size={11}/> Seller</span></div>
          <p className="mt-2 text-sm leading-6 text-[#78857b]">{data.description || "A shop on Eshop-MV. Explore products and discover something you love."}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#f6f8f5] p-3"><div className="flex items-center gap-1.5 text-[#879188]"><FiPackage size={14}/><span className="text-[10px] font-semibold">Products</span></div><p className="mt-1 text-lg font-extrabold text-[#344238]">{products?.length || 0}</p></div>
          <div className="rounded-xl bg-[#f6f8f5] p-3"><div className="flex items-center gap-1.5 text-[#879188]"><FiStar size={14}/><span className="text-[10px] font-semibold">Rating</span></div><p className="mt-1 text-lg font-extrabold text-[#344238]">{averageRating.toFixed(1)}<span className="ml-1 text-xs font-medium text-[#879188]">/ 5</span></p></div>
        </div>
        <div className="mt-5 space-y-3 border-t border-[#edf0ec] pt-5">
          <div className="flex items-start gap-3"><span className="mt-0.5 text-[#8b998e]"><FiMapPin size={16}/></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa49c]">Shop address</p><p className="mt-0.5 text-xs leading-5 text-[#536157]">{data.address || "Address not provided"}</p></div></div>
          <div className="flex items-start gap-3"><span className="mt-0.5 text-[#8b998e]"><FiPhone size={16}/></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa49c]">Contact number</p><p className="mt-0.5 text-xs text-[#536157]">{data.phoneNumber || "Not provided"}</p></div></div>
          <div className="flex items-start gap-3"><span className="mt-0.5 text-[#8b998e]"><FiCalendar size={16}/></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa49c]">Member since</p><p className="mt-0.5 text-xs text-[#536157]">{joinedDate}</p></div></div>
        </div>
        {!isOwner && <Link to="/products" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#315c46] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#254b37]">Explore products <FiArrowUpRight size={15}/></Link>}
      </div>
    </aside>
  );
};
export default ShopInfo;
