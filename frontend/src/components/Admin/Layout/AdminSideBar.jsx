import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";

const AdminSidebar = ({ active }) => {
  const sidebarItems = [
    { id: 1, icon: RxDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { id: 2, icon: FiShoppingBag, label: "All Orders", path: "/admin-orders" },
    { id: 3, icon: HiOutlineUserGroup, label: "All Sellers", path: "/admin-sellers" },
    { id: 4, icon: GrWorkshop, label: "All Users", path: "/admin-users" },
    { id: 5, icon: FaProductHunt, label: "All Products", path: "/admin-products" },
    { id: 6, icon: MdEmojiEvents, label: "All Events", path: "/admin-events" },
    { id: 7, icon: CiMoneyBill, label: "Withdraw Requests", path: "/admin-withdraw-request" },
    { id: 8, icon: MdOutlineSettings, label: "Settings", path: "/admin-settings" },
  ];

  return (
    <div className="w-full h-[89vh] bg-[#fbfcfa] shadow-none overflow-y-auto sticky top-0 left-0 z-10 border-r border-[#e5ebe3]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-[#315c46]">
          Admin Portal
        </h3>
        <p className="text-xs text-gray-500 mt-1">Platform management</p>
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
                className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"} transition-colors`}
              />
              <h5
                className={`hidden 800px:block pl-3 text-[15px] font-medium ${
                  isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
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

export default AdminSidebar;
