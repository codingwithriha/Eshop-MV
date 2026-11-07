import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  const groups = [
    { title: "Workspace", items: [{ id:1,icon:RxDashboard,label:"Overview",path:"/dashboard" },{ id:8,icon:BiMessageSquareDetail,label:"Inbox",path:"/dashboard-messages" },{ id:11,icon:CiSettings,label:"Shop settings",path:"/settings" }] },
    { title: "Sales", items: [{ id:2,icon:FiShoppingBag,label:"Orders",path:"/dashboard-orders" }] },
    { title: "Catalog", items: [{ id:3,icon:FiPackage,label:"Products",path:"/dashboard-products" },{ id:4,icon:AiOutlineFolderAdd,label:"Add product",path:"/dashboard-create-product" }] },
    { title: "Promotions", items: [{ id:5,icon:MdOutlineLocalOffer,label:"Events",path:"/dashboard-events" },{ id:6,icon:VscNewFile,label:"Create event",path:"/dashboard-create-event" },{ id:9,icon:AiOutlineGift,label:"Discount codes",path:"/dashboard-coupouns" }] },
    { title: "Finance", items: [{ id:7,icon:CiMoneyBill,label:"Withdrawals",path:"/dashboard-withdraw-money" },{ id:10,icon:HiOutlineReceiptRefund,label:"Refunds",path:"/dashboard-refunds" }] },
  ];

  return (
    <aside className="fixed left-0 top-[76px] z-20 h-[calc(100dvh-76px)] w-[80px] overflow-x-hidden overflow-y-auto overscroll-contain 800px:w-[330px]" border-r border-[#e5ebe3] bg-[#fbfcfa] px-3 py-6">
      <div className="mb-7 flex items-center gap-3 px-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315c46] text-white"><FiShoppingBag size={20}/></span>
        <div><p className="font-display text-base font-extrabold tracking-tight text-[#26372d]">Seller studio</p><p className="text-[10px] font-medium text-[#879188]">Your business workspace</p></div>
      </div>
      {groups.map(group=><div key={group.title} className="mb-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#a0aaa2]">{group.title}</p>
        <div className="space-y-1">{group.items.map(item=>{
          const Icon=item.icon;const selected=active===item.id;
          return <Link key={item.id} to={item.path} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${selected?"bg-[#315c46] text-white shadow-[0_8px_20px_rgba(49,92,70,.16)]":"text-[#68756c] hover:bg-[#edf2ec] hover:text-[#244735]"}`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${selected?"bg-white/15":"bg-[#f0f3ee] text-[#718176] group-hover:bg-white group-hover:text-[#315c46]"}`}><Icon size={19}/></span>
            <span className="hidden 800px:block">{item.label}</span>
            {selected&&<span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#d9bd91] 800px:block"/>}
          </Link>;
        })}</div>
      </div>)}
      <div className="mt-8 rounded-2xl bg-[#edf2ec] p-4"><p className="text-xs font-bold text-[#315c46]">Grow with Eshop</p><p className="mt-1 text-[11px] leading-5 text-[#77847a]">Keep products, orders and promotions organised in one place.</p></div>
    </aside>
  );
};
export default DashboardSideBar;
