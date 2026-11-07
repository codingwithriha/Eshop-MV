import React from "react";
import ShopSettings from "../../components/Shop/ShopSettings";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

const ShopSettingsPage = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={11} />
    <main className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 800px:ml-[330px]">
      <ShopSettings />
    </main>
  </div>
);
export default ShopSettingsPage;
