import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { FiPlus, FiTag, FiTrash2, FiPercent, FiDollarSign, FiPackage, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../Layout/Loader";
import { server } from "../../server";

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#e2e9e1] bg-white px-3.5 py-3 text-sm text-[#344238] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#789581] focus:ring-4 focus:ring-[#edf3ed]";

const AllCoupons = () => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", value: "", minAmount: "", maxAmount: "", selectedProducts: "" });

  useEffect(() => {
    if (!seller?._id) return;
    let mounted = true;
    axios.get(server + "/coupon/get-coupon/" + seller._id, { withCredentials: true })
      .then(({ data }) => { if (mounted) setCoupons(Array.isArray(data?.couponCode) ? data.couponCode : []); })
      .catch((error) => { if (mounted) toast.error(error.response?.data?.message || "Unable to load discount codes."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [seller?._id]);

  const updateField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!seller?._id) return toast.error("Seller account is not ready yet.");
    setSaving(true);
    try {
      const { data } = await axios.post(server + "/coupon/create-coupun-code", {
        ...form, shop: seller, shopId: seller._id,
      }, { withCredentials: true });
      const created = data?.couponCode || data?.coupon || data?.newCoupon;
      if (created?._id) setCoupons((current) => [created, ...current]);
      else {
        const response = await axios.get(server + "/coupon/get-coupon/" + seller._id, { withCredentials: true });
        setCoupons(Array.isArray(response.data?.couponCode) ? response.data.couponCode : []);
      }
      toast.success("Discount code created successfully.");
      setForm({ name: "", value: "", minAmount: "", maxAmount: "", selectedProducts: "" });
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create the discount code.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this discount code? This cannot be undone.")) return;
    try {
      await axios.delete(server + "/coupon/delete-coupon/" + id, { withCredentials: true });
      setCoupons((current) => current.filter((coupon) => coupon._id !== id));
      toast.success("Discount code deleted.");
    } catch (error) { toast.error(error.response?.data?.message || "Could not delete the discount code."); }
  };

  const columns = useMemo(() => [
    { field: "name", headerName: "CODE NAME", minWidth: 170, flex: 1.2 },
    { field: "value", headerName: "DISCOUNT", minWidth: 115, flex: .7, renderCell: (params) => <span className="rounded-lg bg-[#edf4ed] px-2.5 py-1 font-bold text-[#315c46]">{params.value}% OFF</span> },
    { field: "minAmount", headerName: "MIN. ORDER", minWidth: 120, flex: .8, renderCell: (params) => params.value ? "$" + Number(params.value).toLocaleString() : "—" },
    { field: "maxAmount", headerName: "MAX. DISCOUNT", minWidth: 140, flex: .9, renderCell: (params) => params.value ? "$" + Number(params.value).toLocaleString() : "—" },
    { field: "product", headerName: "APPLIES TO", minWidth: 150, flex: 1, renderCell: (params) => params.value || "Selected shop products" },
    { field: "actions", headerName: "", minWidth: 80, sortable: false, align: "right", renderCell: (params) => <button onClick={() => handleDelete(params.id)} title="Delete discount code" className="rounded-lg p-2 text-[#a45e52] transition hover:bg-[#fff1ee]"><FiTrash2 size={16}/></button> },
  ], []);

  const rows = coupons.map((coupon) => ({ id: coupon._id, name: coupon.name, value: coupon.value, minAmount: coupon.minAmount, maxAmount: coupon.maxAmount, product: coupon.selectedProducts || coupon.productName || "" }));

  if (loading) return <div className="flex min-h-[60vh] w-full items-center justify-center"><Loader /></div>;

  return (
    <main className="min-h-[calc(100vh-76px)] w-full min-w-0 bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Marketing · Promotions</p><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#26372d] sm:text-3xl">Discount codes</h1><p className="mt-2 text-sm text-[#78857b]">Create and manage offers that encourage customers to shop.</p></div>
          <button onClick={() => setOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#315c46] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(49,92,70,.15)] transition hover:bg-[#254b37]"><FiPlus size={17}/> Create discount</button>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e6ebe4] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiTag size={19}/></span><p className="mt-4 text-xs font-medium text-[#849087]">Total discount codes</p><p className="mt-1 font-display text-2xl font-extrabold text-[#26372d]">{coupons.length}</p></div>
          <div className="rounded-2xl border border-[#e6ebe4] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#a17a4f]"><FiPercent size={19}/></span><p className="mt-4 text-xs font-medium text-[#849087]">Highest discount</p><p className="mt-1 font-display text-2xl font-extrabold text-[#26372d]">{coupons.length ? Math.max(...coupons.map((item) => Number(item.value) || 0)) + "%" : "—"}</p></div>
          <div className="rounded-2xl border border-[#e6ebe4] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1f5] text-[#627a91]"><FiPackage size={19}/></span><p className="mt-4 text-xs font-medium text-[#849087]">Shop products</p><p className="mt-1 font-display text-2xl font-extrabold text-[#26372d]">{products?.length || 0}</p></div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_5px_24px_rgba(35,52,40,.04)]">
          <div className="flex flex-col gap-1 border-b border-[#edf0ec] px-5 py-5 sm:px-6"><h2 className="text-base font-bold text-[#29372e]">Your discount codes</h2><p className="text-xs text-[#879188]">Review the offers created for your shop.</p></div>
          {rows.length ? <div className="w-full overflow-x-auto"><div className="min-w-[760px]"><DataGrid rows={rows} columns={columns} autoHeight disableSelectionOnClick pageSize={10} rowsPerPageOptions={[10,25,50]} sx={{ border: 0, color: "#46544a", "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8faf7", borderBottom: "1px solid #e9eee7", fontSize: "11px", fontWeight: 800, letterSpacing: ".06em" }, "& .MuiDataGrid-cell": { borderColor: "#f0f2ef", fontSize: "13px" }, "& .MuiDataGrid-footerContainer": { borderColor: "#edf0ec" } }} /></div></div> :
            <div className="flex flex-col items-center px-6 py-16 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#315c46]"><FiTag size={25}/></span><h3 className="mt-4 text-base font-bold text-[#344238]">No discount codes yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-[#879188]">Create your first offer to give customers an extra reason to buy from your shop.</p><button onClick={() => setOpen(true)} className="mt-5 rounded-xl bg-[#315c46] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#254b37]">Create your first code</button></div>}
        </section>
      </div>

      {open && <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#17231b]/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-[#edf0ec] px-6 py-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a988d]">New promotion</p><h2 className="mt-1 text-xl font-extrabold text-[#26372d]">Create discount code</h2><p className="mt-1 text-xs text-[#879188]">Set the discount and choose where it applies.</p></div><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#78857b] hover:bg-[#f1f4f0]"><FiX size={19}/></button></div>
          <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
            <label className="block text-xs font-bold text-[#536157]">Code name<input className={fieldClass} required value={form.name} onChange={updateField("name")} placeholder="e.g. WELCOME10"/></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold text-[#536157]">Discount percentage<input className={fieldClass} type="number" required min="1" max="100" value={form.value} onChange={updateField("value")} placeholder="10"/></label><label className="block text-xs font-bold text-[#536157]">Minimum order amount<input className={fieldClass} type="number" min="0" value={form.minAmount} onChange={updateField("minAmount")} placeholder="Optional"/></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold text-[#536157]">Maximum discount amount<input className={fieldClass} type="number" min="0" value={form.maxAmount} onChange={updateField("maxAmount")} placeholder="Optional"/></label><label className="block text-xs font-bold text-[#536157]">Apply to product<select className={fieldClass} value={form.selectedProducts} onChange={updateField("selectedProducts")}><option value="">All shop products</option>{products?.map((product) => <option key={product._id} value={product.name}>{product.name}</option>)}</select></label></div>
            <div className="flex flex-col-reverse gap-2 border-t border-[#edf0ec] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#e2e9e1] px-4 py-3 text-sm font-bold text-[#68756c] hover:bg-[#f7f9f6]">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-[#315c46] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#254b37] disabled:opacity-60">{saving ? "Creating..." : "Create discount code"}</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
};
export default AllCoupons;
