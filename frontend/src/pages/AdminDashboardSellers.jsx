import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllSellers from "../components/Admin/AllSellers";
const AdminDashboardSellers=()=> <div className="min-h-screen bg-[#f6f8f5]"><AdminHeader/><div className="flex w-full items-start"><aside className="w-[80px] shrink-0 800px:w-[280px]"><AdminSideBar active={3}/></aside><AllSellers/></div></div>;
export default AdminDashboardSellers;
