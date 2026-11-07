import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiShoppingBag, FiRefreshCw } from "react-icons/fi";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const gridSx = {
  border: 0, color: "#46544a", fontSize: "13px",
  "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8faf7", borderBottom: "1px solid #e9eee7", color: "#77847a", fontSize: "10px", fontWeight: 800, letterSpacing: ".08em" },
  "& .MuiDataGrid-cell": { borderColor: "#eff2ed", outline: "none !important" },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#f8faf7" },
  "& .MuiDataGrid-footerContainer": { borderColor: "#edf0ec" },
};

const OrderTable = ({ refundsOnly = false }) => {
  const { orders = [], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller?._id]);

  const filteredOrders = refundsOnly ? orders.filter((order) => order.status === "Processing refund") : orders;
  const rows = useMemo(() => filteredOrders.map((item) => ({
    id: item._id,
    itemsQty: Array.isArray(item.cart) ? item.cart.length : 0,
    total: item.totalPrice == null ? "—" : "$" + Number(item.totalPrice).toLocaleString(),
    status: item.status || "Pending",
  })), [filteredOrders]);

  const columns = [
    { field: "id", headerName: "ORDER ID", minWidth: 190, flex: 1.1, renderCell: (params) => <span className="font-semibold text-[#526157]">{String(params.value).slice(-12)}</span> },
    { field: "status", headerName: "STATUS", minWidth: 155, flex: .9, renderCell: (params) => <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${params.value === "Delivered" ? "bg-[#edf4ed] text-[#315c46]" : params.value === "Processing refund" ? "bg-[#fff3e5] text-[#a16e32]" : "bg-[#f1f3f0] text-[#68756c]"}`}>{params.value}</span> },
    { field: "itemsQty", headerName: "ITEMS", minWidth: 100, flex: .55 },
    { field: "total", headerName: "ORDER TOTAL", minWidth: 140, flex: .8 },
    { field: "actions", headerName: "", minWidth: 90, sortable: false, filterable: false, renderCell: (params) => <Link title="View order" to={`/order/${params.id}`} className="rounded-lg p-2 text-[#315c46] transition hover:bg-[#edf3ed]"><FiArrowUpRight size={18}/></Link> },
  ];

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader/></div>;

  const title = refundsOnly ? "Refund requests" : "Orders";
  const Icon = refundsOnly ? FiRefreshCw : FiShoppingBag;

  return (
    <main className="min-h-[calc(100vh-76px)] w-full min-w-0 bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Sales · Management</p><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#26372d] sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-[#78857b]">{refundsOnly ? "Review orders that are currently being processed for a refund." : "Track customer purchases, order status and sales totals."}</p></div>
        <section className="overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_5px_24px_rgba(35,52,40,.04)]">
          <div className="flex items-center justify-between border-b border-[#edf0ec] px-5 py-5 sm:px-6"><div><h2 className="text-base font-bold text-[#29372e]"> {refundsOnly ? "Refund queue" : "Recent orders"}</h2><p className="mt-1 text-xs text-[#879188]">{rows.length} {refundsOnly ? "refund requests" : "orders"} found</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><Icon size={19}/></span></div>
          {rows.length ? <div className="w-full overflow-x-auto"><div className="min-w-[620px]"><DataGrid rows={rows} columns={columns} autoHeight disableSelectionOnClick pageSize={10} rowsPerPageOptions={[10,25,50]} sx={gridSx}/></div></div> :
            <div className="flex flex-col items-center px-6 py-16 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#315c46]"><Icon size={25}/></span><h3 className="mt-4 text-base font-bold text-[#344238]">{refundsOnly ? "No refund requests" : "No orders yet"}</h3><p className="mt-1 max-w-sm text-sm leading-6 text-[#879188]">{refundsOnly ? "Refund requests will appear here when a customer asks for one." : "Customer orders will appear here as soon as your shop makes its first sale."}</p></div>}
        </section>
      </div>
    </main>
  );
};
export default function AllRefundOrders(){return <OrderTable refundsOnly/>;}
