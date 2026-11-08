import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FiPlus, FiPackage, FiEye, FiTrash2, FiBox } from "react-icons/fi";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";

const gridSx = {
  border: 0, color: "#46544a", fontSize: "13px",
  "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8faf7", borderBottom: "1px solid #e9eee7", color: "#77847a", fontSize: "10px", fontWeight: 800, letterSpacing: ".08em" },
  "& .MuiDataGrid-cell": { borderColor: "#eff2ed", outline: "none !important" },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#f8faf7" },
  "& .MuiDataGrid-footerContainer": { borderColor: "#edf0ec" },
};

const AllProducts = () => {
  const { products = [], isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    try {
      await dispatch(deleteProduct(id));
      toast.success("Product deleted successfully.");
      if (seller?._id) dispatch(getAllProductsShop(seller._id));
    } catch (error) {
      toast.error(error?.message || "Unable to delete this product.");
    }
  };

  const rows = useMemo(() => products.map((item) => ({
    id: item._id,
    name: item.name || "Untitled product",
    price: item.discountPrice == null ? "—" : "$" + Number(item.discountPrice).toLocaleString(),
    stock: item.stock ?? 0,
    sold: item.sold_out ?? 0,
  })), [products]);

  const columns = [
    { field: "name", headerName: "PRODUCT", minWidth: 220, flex: 1.5 },
    { field: "price", headerName: "PRICE", minWidth: 120, flex: .7 },
    { field: "stock", headerName: "STOCK", minWidth: 100, flex: .6 },
    { field: "sold", headerName: "SOLD", minWidth: 100, flex: .6 },
    { field: "actions", headerName: "ACTIONS", minWidth: 130, sortable: false, filterable: false, renderCell: (params) => <div className="flex items-center gap-1"><Link title="Preview product" to={`/product/${params.id}`} className="rounded-lg p-2 text-[#315c46] transition hover:bg-[#edf3ed]"><FiEye size={17}/></Link><button title="Delete product" onClick={() => handleDelete(params.id)} className="rounded-lg p-2 text-[#a45e52] transition hover:bg-[#fff1ee]"><FiTrash2 size={16}/></button></div> },
  ];

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader/></div>;

  return (
    <main className="min-h-[calc(100vh-76px)] w-full min-w-0 bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Catalog · Inventory</p><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#26372d] sm:text-3xl">Products</h1><p className="mt-2 text-sm text-[#78857b]">Manage your product listings, pricing and available stock.</p></div>
          <Link to="/dashboard-create-product" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#315c46] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(49,92,70,.15)] transition hover:bg-[#254b37]"><FiPlus size={17}/> Add product</Link>
        </div>
        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e6ebe4] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiPackage size={19}/></span><p className="mt-4 text-xs font-medium text-[#849087]">Total products</p><p className="mt-1 font-display text-2xl font-extrabold text-[#26372d]">{products.length}</p></div>
          <div className="rounded-2xl border border-[#e6ebe4] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#a17a4f]"><FiBox size={19}/></span><p className="mt-4 text-xs font-medium text-[#849087]">Units in stock</p><p className="mt-1 font-display text-2xl font-extrabold text-[#26372d]">{products.reduce((sum, item) => sum + (Number(item.stock) || 0), 0).toLocaleString()}</p></div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_5px_24px_rgba(35,52,40,.04)]">
          <div className="border-b border-[#edf0ec] px-5 py-5 sm:px-6"><h2 className="text-base font-bold text-[#29372e]">Your products</h2><p className="mt-1 text-xs text-[#879188]">Review and maintain your shop catalogue.</p></div>
          {rows.length ? <div className="w-full overflow-x-auto"><div className="min-w-[620px]"><DataGrid rows={rows} columns={columns} autoHeight disableSelectionOnClick pageSize={10} rowsPerPageOptions={[10,25,50]} sx={gridSx}/></div></div> :
            <div className="flex flex-col items-center px-6 py-16 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#315c46]"><FiPackage size={25}/></span><h3 className="mt-4 text-base font-bold text-[#344238]">No products listed yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-[#879188]">Add your first product to start building your shop catalogue.</p><Link to="/dashboard-create-product" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#315c46] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#254b37]"><FiPlus size={15}/> Add your first product</Link></div>}
        </section>
      </div>
    </main>
  );
};
export default AllProducts;
