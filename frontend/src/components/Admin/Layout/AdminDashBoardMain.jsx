import React, { useEffect } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfAdmin } from "../../../redux/actions/order";
import Loader from "../../../components/Layout/Loader";
import { getAllSellers } from "../../../redux/actions/seller";
import DashboardAnalytics from "../../Layout/DashboardAnalytics";

const AdminDashBoardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders = [], isLoading } = useSelector((state) => state.order || {});
  const { sellers = [] } = useSelector((state) => state.seller || {});

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const orders = Array.isArray(adminOrders) ? adminOrders : [];
  const sellerList = Array.isArray(sellers) ? sellers : [];
  const adminBalance = orders.reduce((total, order) => total + Number(order?.totalPrice || 0) * 0.1, 0);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 170, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.8, renderCell: (params) => <span className={`rounded-full px-3 py-1 text-xs font-bold ${params.value === "Delivered" ? "bg-[#eaf3eb] text-[#315c46]" : "bg-[#f7f0e8] text-[#a47c50]"}`}>{params.value || "Processing"}</span> },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 90, flex: 0.5 },
    { field: "total", headerName: "Order total", minWidth: 120, flex: 0.7 },
    { field: "createdAt", headerName: "Order date", minWidth: 130, flex: 0.7 },
  ];

  const rows = orders.map((item) => ({
    id: item?._id,
    itemsQty: item?.cart?.reduce((sum, product) => sum + Number(product?.qty || 0), 0) || 0,
    total: `$${Number(item?.totalPrice || 0).toFixed(2)}`,
    status: item?.status || "Processing",
    createdAt: item?.createdAt ? String(item.createdAt).slice(0, 10) : "—",
  })).filter((row) => row.id);

  if (isLoading) return <div className="flex-1 bg-[#f6f8f5] p-8"><Loader /></div>;

  return (
    <main className="min-w-0 flex-1 bg-[#f6f8f5] p-5 sm:p-7">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#66806e]">Platform overview</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-.04em] text-[#202923]">Good to see you, Admin.</h1>
          <p className="mt-2 text-sm text-[#7b867e]">Here is what is happening across your marketplace.</p>
        </div>
        <span className="rounded-full border border-[#e1e8df] bg-white px-4 py-2 text-xs font-semibold text-[#718076]">Marketplace overview</span>
      </div>

      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <article className="min-h-[150px] rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ec] text-[#315c46]"><AiOutlineMoneyCollect size={22}/></span><span className="text-sm font-semibold text-[#718076]">Total earnings</span></div>
          <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#26372d]">${adminBalance.toFixed(2)}</p>
          <p className="mt-1 text-xs text-[#929d94]">Calculated at the existing 10% commission rate</p>
        </article>
        <article className="min-h-[150px] rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ec] text-[#315c46]"><MdBorderClear size={22}/></span><span className="text-sm font-semibold text-[#718076]">Registered sellers</span></div>
          <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#26372d]">{sellerList.length}</p>
          <Link to="/admin-sellers" className="mt-1 inline-flex text-xs font-bold text-[#315c46] hover:text-[#244735]">View sellers <span className="ml-1">→</span></Link>
        </article>
        <article className="min-h-[150px] rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ec] text-[#315c46]"><AiOutlineMoneyCollect size={22}/></span><span className="text-sm font-semibold text-[#718076]">Total orders</span></div>
          <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#26372d]">{orders.length}</p>
          <Link to="/admin-orders" className="mt-1 inline-flex text-xs font-bold text-[#315c46] hover:text-[#244735]">View orders <span className="ml-1">→</span></Link>
        </article>
      </section>

      <DashboardAnalytics orders={orders} heading="Marketplace performance" />

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#e7ebe5] bg-white p-3 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2 px-2 pb-4 pt-2">
          <div><h2 className="font-display text-lg font-extrabold text-[#26372d]">Recent orders</h2><p className="mt-1 text-xs text-[#879188]">Latest transactions across the marketplace</p></div>
          <Link to="/admin-orders" className="text-xs font-bold text-[#315c46] hover:text-[#244735]">All orders →</Link>
        </div>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5,10]} disableSelectionOnClick autoHeight sx={{border:0,fontFamily:"'DM Sans',sans-serif","& .MuiDataGrid-columnHeaders":{backgroundColor:"#f5f7f3",borderRadius:"12px"},"& .MuiDataGrid-cell":{borderColor:"#edf0eb"},"& .MuiDataGrid-footerContainer":{borderColor:"#edf0eb"}}}/>
      </section>
    </main>
  );
};

export default AdminDashBoardMain;
