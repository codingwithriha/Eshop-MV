import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiLogOut } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(server + "/shop/logout", { withCredentials: true });
      dispatch({ type: "LoadSellerFail", payload: "Logged out" });
      toast.success(data?.message || "Logged out successfully.");
      navigate("/shop-login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] w-full items-center justify-between border-b border-[#e7ebe5] bg-white/95 px-4 shadow-[0_4px_20px_rgba(32,41,35,.04)] backdrop-blur-xl sm:px-7">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315c46] font-display text-lg font-extrabold text-white">E</span>
        <span className="font-display text-lg font-extrabold tracking-tight text-[#26372d]">eshop<span className="text-[#b58a5a]">.</span><span className="ml-2 hidden text-[10px] font-bold uppercase tracking-[.14em] text-[#879188] sm:inline">Seller studio</span></span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link to="/dashboard-coupouns" aria-label="Discount codes" title="Discount codes" className="hidden rounded-xl p-2.5 text-[#526258] transition hover:bg-[#edf2ec] hover:text-[#315c46] sm:inline-flex"><AiOutlineGift size={23}/></Link>
        <Link to="/dashboard-events" aria-label="Events" title="Events" className="hidden rounded-xl p-2.5 text-[#526258] transition hover:bg-[#edf2ec] hover:text-[#315c46] sm:inline-flex"><MdOutlineLocalOffer size={23}/></Link>
        <Link to="/dashboard-orders" aria-label="Orders" title="Orders" className="hidden rounded-xl p-2.5 text-[#526258] transition hover:bg-[#edf2ec] hover:text-[#315c46] sm:inline-flex"><FiShoppingBag size={22}/></Link>
        <Link to="/dashboard-products" aria-label="Products" title="Products" className="hidden rounded-xl p-2.5 text-[#526258] transition hover:bg-[#edf2ec] hover:text-[#315c46] sm:inline-flex"><FiPackage size={22}/></Link>
        <Link to="/dashboard-messages" aria-label="Messages" title="Messages" className="hidden rounded-xl p-2.5 text-[#526258] transition hover:bg-[#edf2ec] hover:text-[#315c46] sm:inline-flex"><BiMessageSquareDetail size={22}/></Link>
        {seller && <Link to={"/shop/" + seller._id} title="View shop" className="ml-1 hidden items-center gap-2 rounded-full border border-[#e5ebe3] p-1 pr-3 transition hover:bg-[#f5f8f4] sm:flex">
          {seller.avatar?.url ? <img src={seller.avatar.url} className="h-9 w-9 rounded-full object-cover" alt="Seller profile"/> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2ec] font-bold text-[#315c46]">{(seller.name || "S").charAt(0).toUpperCase()}</span>}
          <span className="max-w-[110px] truncate text-xs font-bold text-[#344238]">{seller.name || "My shop"}</span>
        </Link>}
        <button type="button" onClick={handleLogout} aria-label="Log out of seller account" className="ml-1 inline-flex items-center gap-2 rounded-xl border border-[#eaded8] bg-white px-3 py-2.5 text-xs font-bold text-[#9a5145] transition hover:bg-[#fff7f5]">
          <FiLogOut size={17}/><span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
