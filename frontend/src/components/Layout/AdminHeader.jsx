import React from "react";
import { FiBell, FiHome, FiPackage, FiShoppingBag, FiUsers } from "react-icons/fi";
import { MdEmojiEvents } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <header className="sticky top-0 z-30 flex h-[76px] w-full items-center justify-between border-b border-[#e7ebe5] bg-white/95 px-4 shadow-[0_4px_20px_rgba(32,41,35,.04)] backdrop-blur-xl sm:px-7">
      <Link to="/admin/dashboard" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315c46] font-display text-lg font-extrabold text-white">E</span>
        <span><span className="block font-display text-base font-extrabold tracking-tight text-[#243329]">eshop<span className="text-[#b58a5a]">.</span></span><span className="block text-[10px] font-bold uppercase tracking-[.15em] text-[#829087]">Administration</span></span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {[[FiHome,"Overview","/admin/dashboard"],[FiShoppingBag,"Orders","/admin-orders"],[FiUsers,"Sellers","/admin-sellers"],[FiPackage,"Products","/admin-products"],[MdEmojiEvents,"Events","/admin-events"]].map(([Icon,label,path])=>(
          <Link key={path} to={path} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#66736a] transition hover:bg-[#edf2ec] hover:text-[#315c46]"><Icon size={16}/>{label}</Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block"><span className="block text-xs font-bold text-[#29372e]">{user?.name || "Administrator"}</span><span className="block text-[10px] text-[#879188]">Platform administrator</span></span>
        {user?.avatar?.url ? <img src={user.avatar.url} alt="Administrator profile" className="h-10 w-10 rounded-full border-2 border-[#dce7dc] object-cover"/> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2ec] font-bold text-[#315c46]">{(user?.name || "A").charAt(0).toUpperCase()}</span>}
      </div>
    </header>
  );
};

export default AdminHeader;
