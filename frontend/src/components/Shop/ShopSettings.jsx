import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { FiCamera, FiMapPin, FiPhone, FiMap, FiSave, FiStore, FiCheckCircle } from "react-icons/fi";
import { getSeller } from "../../redux/actions/seller";
import { toast } from "react-toastify";
import axios from "axios";

const field = "mt-2 w-full rounded-xl border border-[#e2e9e1] bg-white px-4 py-3 text-sm text-[#344238] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#789581] focus:ring-4 focus:ring-[#edf3ed]";
const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipcode] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!seller) return;
    setName(seller.name || "");
    setDescription(seller.description || "");
    setAddress(seller.address || "");
    setPhoneNumber(seller.phoneNumber || "");
    setZipcode(seller.zipCode || "");
    setAvatarPreview(seller.avatar?.url || "");
  }, [seller]);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Please choose an image smaller than 5 MB.");
    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result;
      setAvatar(imageData);
      setAvatarPreview(imageData);
      try {
        await axios.put(server + "/shop/update-shop-avatar", { avatar: imageData }, { withCredentials: true });
        dispatch(getSeller());
        toast.success("Shop image updated.");
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to update shop image.");
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.put(server + "/shop/update-seller-info", { name, description, address, phoneNumber, zipCode }, { withCredentials: true });
      await dispatch(getSeller());
      toast.success("Shop details updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update shop details.");
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Seller studio · Preferences</p><h1 className="mt-2 font-display text-2xl font-extrabold text-[#26372d] sm:text-3xl">Shop settings</h1><p className="mt-2 text-sm text-[#78857b]">Keep your public shop details accurate and up to date.</p></div>
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_5px_24px_rgba(35,52,40,.04)]">
            <div className="h-24 bg-[linear-gradient(120deg,#294c39,#52765d_58%,#b18a60)]"/>
            <div className="px-5 pb-6 text-center">
              <div className="relative mx-auto -mt-14 h-28 w-28">
                <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-[#edf2ec] shadow">{avatarPreview ? <img src={avatarPreview} alt="Shop profile" className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center font-display text-3xl font-extrabold text-[#315c46]">{(name || "S").charAt(0).toUpperCase()}</div>}</div>
                <label title="Change shop image" className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-[#315c46] text-white shadow"><FiCamera size={16}/><input type="file" accept="image/*" className="hidden" onChange={handleImage}/></label>
              </div>
              <h2 className="mt-4 text-base font-extrabold text-[#29372e]">{name || "Your shop"}</h2><p className="mt-1 text-xs text-[#879188]">Shop profile preview</p>
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#f2f6f1] px-3 py-2 text-[11px] font-bold text-[#52765d]"><FiCheckCircle size={14}/> Seller account</div>
            </div>
          </aside>
          <form onSubmit={updateHandler} className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#edf0ec] pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiStore size={19}/></span><div><h2 className="text-base font-bold text-[#29372e]">Public shop information</h2><p className="text-xs text-[#879188]">These details help customers identify and contact your shop.</p></div></div>
            <div className="space-y-5">
              <div><label className="text-xs font-bold text-[#536157]">Shop name <span className="text-red-500">*</span></label><input required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Your shop name"/></div>
              <div><label className="text-xs font-bold text-[#536157]">Shop description</label><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={field + " resize-y"} placeholder="Tell customers what your shop offers."/></div>
              <div><label className="flex items-center gap-2 text-xs font-bold text-[#536157]"><FiMapPin/> Shop address <span className="text-red-500">*</span></label><input required value={address} onChange={(e) => setAddress(e.target.value)} className={field} placeholder="Street, city and area"/></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className="flex items-center gap-2 text-xs font-bold text-[#536157]"><FiPhone/> Phone number <span className="text-red-500">*</span></label><input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={field} placeholder="Contact number"/></div><div><label className="flex items-center gap-2 text-xs font-bold text-[#536157]"><FiMap/> ZIP / postal code <span className="text-red-500">*</span></label><input required value={zipCode} onChange={(e) => setZipcode(e.target.value)} className={field} placeholder="Postal code"/></div></div>
            </div>
            <div className="mt-7 flex justify-end border-t border-[#edf0ec] pt-5"><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#315c46] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#254b37] disabled:opacity-60"><FiSave size={16}/>{saving ? "Saving changes..." : "Save shop details"}</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ShopSettings;
