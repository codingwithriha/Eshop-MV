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
  const sidebarItems = [
    { id: 1, icon: RxDashboard, label: "Dashboard", path: "/dashboard" },
    { id: 2, icon: FiShoppingBag, label: "All Orders", path: "/dashboard-orders" },
    { id: 3, icon: FiPackage, label: "All Products", path: "/dashboard-products" },
    { id: 4, icon: AiOutlineFolderAdd, label: "Create Product", path: "/dashboard-create-product" },
    { id: 5, icon: MdOutlineLocalOffer, label: "All Events", path: "/dashboard-events" },
    { id: 6, icon: VscNewFile, label: "Create Event", path: "/dashboard-create-event" },
    { id: 7, icon: CiMoneyBill, label: "Withdraw Money", path: "/dashboard-withdraw-money" },
    { id: 8, icon: BiMessageSquareDetail, label: "Shop Inbox", path: "/dashboard-messages" },
    { id: 9, icon: AiOutlineGift, label: "Discount Codes", path: "/dashboard-coupouns" },
    { id: 10, icon: HiOutlineReceiptRefund, label: "Refunds", path: "/dashboard-refunds" },
    { id: 11, icon: CiSettings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-full h-[89vh] bg-[#fbfcfa] shadow-none overflow-y-auto sticky top-0 left-0 z-10 border-r border-[#e5ebe3]">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-[#315c46]">
          Seller Portal
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Manage your shop
        </p>
      </div>

      {/* Sidebar Items */}
      <div className="py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center px-6 py-3 mx-3 mb-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#315c46] text-white shadow-[0_8px_20px_rgba(49,92,70,.18)]"
                  : "text-[#69766d] hover:bg-[#edf2ec] hover:text-[#244735]"
              }`}
            >
              <Icon
                size={24}
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                } transition-colors`}
              />

              <h5
                className={`hidden 800px:block pl-3 text-[15px] font-medium ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {item.label}
              </h5>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSideBar;