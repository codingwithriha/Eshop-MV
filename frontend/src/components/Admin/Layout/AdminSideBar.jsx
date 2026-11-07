import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { MdEmojiEvents, MdOutlineSettings } from "react-icons/md";

const AdminSidebar = ({ active }) => {
  const sidebarItems = [
    { id: 1, icon: RxDashboard, label: "Dashboard", path: "/admin/dashboard", group: "Workspace" },
    { id: 2, icon: FiShoppingBag, label: "Orders", path: "/admin-orders", group: "Management" },
    { id: 3, icon: HiOutlineUserGroup, label: "Sellers", path: "/admin-sellers", group: "Management" },
    { id: 4, icon: GrWorkshop, label: "Customers", path: "/admin-users", group: "Management" },
    { id: 5, icon: FaProductHunt, label: "Products", path: "/admin-products", group: "Catalog" },
    { id: 6, icon: MdEmojiEvents, label: "Events", path: "/admin-events", group: "Catalog" },
    { id: 7, icon: CiMoneyBill, label: "Withdrawals", path: "/admin-withdraw-request", group: "Finance" },
    { id: 8, icon: MdOutlineSettings, label: "Settings", path: "/admin-settings", group: "System" },
  ];

  return (
    <aside className="fixed left-0 top-[76px] z-20 h-[calc(100dvh-76px)] w-[80px] overflow-x-hidden overflow-y-auto overscroll-contain 800px:w-[330px]" border-r border-[#e5ebe3] bg-[#fbfcfa] px-3 py-6">
      <div className="mb-7 px-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#87958a]">Control centre</p>
        <h2 className="mt-2 font-display text-lg font-extrabold tracking-tight text-[#26372d]">Manage your platform</h2>
      </div>
      {["Workspace","Management","Catalog","Finance","System"].map((group)=>(
        <div key={group} className="mb-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#a0aaa2]">{group}</p>
          <div className="space-y-1">
            {sidebarItems.filter(item=>item.group===group).map((item)=>{
              const Icon=item.icon; const isActive=active===item.id;
              return <Link key={item.id} to={item.path} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${isActive?"bg-[#315c46] text-white shadow-[0_8px_20px_rgba(49,92,70,.16)]":"text-[#68756c] hover:bg-[#edf2ec] hover:text-[#244735]"}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive?"bg-white/15":"bg-[#f0f3ee] text-[#718176] group-hover:bg-white group-hover:text-[#315c46]"}`}><Icon size={19}/></span>
                <span className="hidden 800px:block">{item.label}</span>
                {isActive&&<span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#d9bd91] 800px:block"/>}
              </Link>;
            })}
          </div>
        </div>
      ))}
      <div className="mt-8 rounded-2xl bg-[#edf2ec] p-4">
        <p className="text-xs font-bold text-[#315c46]">Eshop-MV Admin</p>
        <p className="mt-1 text-[11px] leading-5 text-[#77847a]">A clear view of your marketplace operations.</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
