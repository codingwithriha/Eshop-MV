import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { createevent, getAllEventsShop } from "../../redux/actions/event";
import { toast } from "react-toastify";
import { FiCalendar, FiUploadCloud, FiX, FiArrowLeft, FiTag } from "react-icons/fi";

const field = "mt-2 w-full rounded-xl border border-[#e2e9e1] bg-white px-4 py-3 text-sm text-[#344238] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#789581] focus:ring-4 focus:ring-[#edf3ed]";
const Label = ({ children }) => <label className="block text-xs font-bold text-[#536157]">{children}</label>;

const CreateEvent = () => {
  const { success, error } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: "clearErrors" }); }
    if (success) {
      toast.success("Event product created successfully.");
      dispatch(getAllEventsShop(seller?._id));
      navigate("/dashboard-events");
    }
  }, [dispatch, error, success, navigate, seller?._id]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then((results) => setImages((current) => [...current, ...results]))
      .catch(() => toast.error("Unable to read one of the selected images."));
    event.target.value = "";
  };

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate ? new Date(new Date(startDate).getTime() + 3 * 86400000).toISOString().slice(0, 10) : "";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!seller?._id) return toast.error("Seller account is not ready. Please sign in again.");
    if (!images.length) return toast.error("Please upload at least one event image.");
    if (!startDate || !endDate) return toast.error("Please select both event dates.");
    dispatch(createevent({
      name, description, category, tags, originalPrice, discountPrice, stock, images,
      shopId: seller._id,
      start_Date: new Date(startDate).toISOString(),
      Finish_Date: new Date(endDate).toISOString(),
    }));
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Marketing · Campaigns</p><h1 className="mt-2 font-display text-2xl font-extrabold text-[#26372d] sm:text-3xl">Create an event</h1><p className="mt-2 text-sm text-[#78857b]">Set up a limited-time offer and schedule when customers can shop it.</p></div>
          <Link to="/dashboard-events" className="inline-flex items-center gap-2 rounded-xl border border-[#e1e8df] bg-white px-4 py-2.5 text-xs font-bold text-[#536157] hover:bg-[#f1f5f0]"><FiArrowLeft/> Back to events</Link>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-7">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiCalendar size={19}/></span><div><h2 className="text-base font-bold text-[#29372e]">Event details</h2><p className="text-xs text-[#879188]">Name, description and category</p></div></div>
              <div className="space-y-5"><div><Label>Event product name <span className="text-red-500">*</span></Label><input required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="e.g. Summer essentials sale"/></div><div><Label>Description <span className="text-red-500">*</span></Label><textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={field + " resize-y"} placeholder="Describe the offer and featured product."/></div><div className="grid gap-4 sm:grid-cols-2"><div><Label>Category <span className="text-red-500">*</span></Label><select required value={category} onChange={(e) => setCategory(e.target.value)} className={field}><option value="">Choose a category</option>{categoriesData?.map((item) => <option key={item.title} value={item.title}>{item.title}</option>)}</select></div><div><Label>Tags</Label><input value={tags} onChange={(e) => setTags(e.target.value)} className={field} placeholder="sale, seasonal, limited"/></div></div></div>
            </section>
            <section className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-7">
              <h2 className="text-base font-bold text-[#29372e]">Pricing and event dates</h2><p className="mb-5 mt-1 text-xs text-[#879188]">Choose the event price, inventory and schedule.</p>
              <div className="grid gap-4 sm:grid-cols-3"><div><Label>Original price</Label><input type="number" min="0" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={field} placeholder="0.00"/></div><div><Label>Sale price <span className="text-red-500">*</span></Label><input required type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className={field} placeholder="0.00"/></div><div><Label>Stock quantity <span className="text-red-500">*</span></Label><input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={field} placeholder="0"/></div></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><Label>Event start date <span className="text-red-500">*</span></Label><input required type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className={field}/></div><div><Label>Event end date <span className="text-red-500">*</span></Label><input required type="date" min={minEndDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={field}/><p className="mt-1.5 text-[10px] text-[#9aa49c]">The existing event rule requires at least 3 days.</p></div></div>
            </section>
          </div>
          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)]">
              <div className="flex items-center gap-2"><FiTag className="text-[#52765d]"/><h2 className="text-base font-bold text-[#29372e]">Event images</h2></div><p className="mb-4 mt-1 text-xs leading-5 text-[#879188]">Upload clear images for your promotion.</p>
              <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dce6da] bg-[#f8faf7] p-5 text-center transition hover:border-[#8ca58f] hover:bg-[#f1f6f0]"><FiUploadCloud size={28} className="text-[#52765d]"/><span className="mt-3 text-xs font-bold text-[#405448]">Choose images</span><span className="mt-1 text-[10px] text-[#929d94]">Select one or more image files</span><input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange}/></label>
              {images.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{images.map((image, index) => <div key={image} className="group relative aspect-square overflow-hidden rounded-lg bg-[#f1f4f0]"><img src={image} alt={"Event preview " + (index + 1)} className="h-full w-full object-cover"/><button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="absolute right-1 top-1 rounded-full bg-white/90 p-1.5 text-[#a45e52] shadow"><FiX size={13}/></button></div>)}</div>}
              <p className="mt-3 text-[10px] text-[#9aa49c]">{images.length} image{images.length === 1 ? "" : "s"} selected</p>
            </section>
            <div className="rounded-2xl bg-[#315c46] p-5 text-white"><p className="text-sm font-bold">Ready to launch?</p><p className="mt-1 text-xs leading-5 text-white/70">Review the dates, price and images before creating your event.</p><button type="submit" className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#315c46] transition hover:bg-[#edf3ed]">Create event</button></div>
          </aside>
        </form>
      </div>
    </div>
  );
};
export default CreateEvent;
