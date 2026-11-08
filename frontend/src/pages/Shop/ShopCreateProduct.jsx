import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={4} />
    <main className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 px-4 py-7 800px:ml-[330px] sm:px-7">
      <CreateProduct />
    </main>
  </div>
);
export default ShopCreateProduct;
