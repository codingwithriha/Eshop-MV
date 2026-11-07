import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiMapPin, FiPhone, FiMail, FiLock, FiShoppingBag, FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
  const navigate = useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [address,setAddress]=useState("");
  const [zipCode,setZipCode]=useState("");
  const [phoneNumber,setPhoneNumber]=useState("");
  const [avatar,setAvatar]=useState(null);
  const [password,setPassword]=useState("");
  const [visible,setVisible]=useState(false);
  const [submitting,setSubmitting]=useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(submitting)return;
    setSubmitting(true);
    try{
      const res=await axios.post(`${server}/shop/create-shop`,{name,email,address,zipCode,phoneNumber,password,avatar});
      toast.success(res.data.message);
      setName("");setEmail("");setPassword("");setAvatar(null);setZipCode("");setPhoneNumber("");setAddress("");
      navigate("/login");
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to create your shop. Please try again.");
    }finally{setSubmitting(false);}
  };

  const handleFileInputChange=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){toast.error("Please select an image file.");return;}
    const reader=new FileReader();
    reader.onload=()=>{if(reader.readyState===2)setAvatar(reader.result);};
    reader.readAsDataURL(file);
  };

  const inputClass="mt-2 h-12 w-full rounded-xl border border-[#e2e8e0] bg-[#fbfcfa] px-4 text-sm text-[#26352b] outline-none transition placeholder:text-[#a0aaa2] focus:border-[#315c46] focus:bg-white focus:ring-4 focus:ring-[#315c46]/[.07]";
  const fields=[
    {label:"Shop name",name:"shop-name",type:"text",value:name,set:setName,placeholder:"e.g. The Modern Store",icon:FiShoppingBag,auto:"organization"},
    {label:"Contact email",name:"email",type:"email",value:email,set:setEmail,placeholder:"you@yourstore.com",icon:FiMail,auto:"email"},
    {label:"Phone number",name:"phone-number",type:"tel",value:phoneNumber,set:setPhoneNumber,placeholder:"+1 234 567 890",icon:FiPhone,auto:"tel"},
    {label:"Business address",name:"address",type:"text",value:address,set:setAddress,placeholder:"Street, city and country",icon:FiMapPin,auto:"street-address"},
    {label:"ZIP / Postal code",name:"zipcode",type:"text",value:zipCode,set:setZipCode,placeholder:"Postal code",icon:FiMapPin,auto:"postal-code"},
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#718076] transition hover:text-[#315c46]"><FiArrowLeft/> Back to marketplace</Link>
        <div className="mt-7 grid overflow-hidden rounded-[28px] border border-[#e5ebe3] bg-white shadow-[0_24px_80px_rgba(32,41,35,.08)] lg:grid-cols-[.82fr_1.18fr]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-[#20372a] p-8 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border border-white/10"/><div className="absolute -right-16 -top-12 h-56 w-56 rounded-full border border-white/10"/>
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9bd91] font-display text-xl font-extrabold text-[#26372d]">E</div>
              <p className="mt-10 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#d9bd91]">Seller onboarding</p>
              <h1 className="mt-4 max-w-sm font-display text-4xl font-extrabold leading-[1.08] tracking-[-.05em] sm:text-5xl">Bring your store to life.</h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">Create your seller account and start building a storefront customers can discover and shop.</p>
            </div>
            <div className="relative mt-12 space-y-4">
              {["A dedicated space for your products","Manage orders and customer activity","Create offers and limited-time events"].map(line=><div key={line} className="flex items-center gap-3 text-sm text-white/80"><FiCheckCircle className="shrink-0 text-[#d9bd91]"/>{line}</div>)}
              <div className="mt-8 border-t border-white/15 pt-5 text-xs text-white/45">Already have a seller account? <Link to="/shop-login" className="font-bold text-[#e5cda8] hover:text-white">Sign in</Link></div>
            </div>
          </section>

          <section className="p-6 sm:p-9 lg:p-12">
            <div className="mb-8"><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#66806e]">Get started</span><h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#202923] sm:text-3xl">Create your shop</h2><p className="mt-2 text-sm leading-6 text-[#7b867e]">Add your business details below. You can refine your storefront after registration.</p></div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map(({label,name,type,value,set,placeholder,icon:Icon,auto})=><div key={name}>
                  <label htmlFor={name} className="text-xs font-bold text-[#455349]">{label}</label>
                  <div className="relative"><Icon className="absolute left-4 top-[26px] text-[#8b998e]" size={16}/><input id={name} name={name} type={type} autoComplete={auto} required value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={`${inputClass} pl-11`}/></div>
                </div>)}
              </div>

              <div>
                <label htmlFor="shop-password" className="text-xs font-bold text-[#455349]">Password</label>
                <div className="relative"><FiLock className="absolute left-4 top-[26px] text-[#8b998e]" size={16}/><input id="shop-password" type={visible?"text":"password"} autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a secure password" className={`${inputClass} pl-11 pr-12`}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?"Hide password":"Show password"} className="absolute right-4 top-[25px] text-[#819087]">{visible?<AiOutlineEye size={19}/>:<AiOutlineEyeInvisible size={19}/>}</button></div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#455349]">Shop profile image <span className="font-normal text-[#9aa49c]">(optional)</span></label>
                <label htmlFor="shop-avatar" className="mt-2 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#d6e0d5] bg-[#f8faf7] p-4 transition hover:border-[#315c46] hover:bg-[#f1f5ef]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eaf0e8] text-[#66806e]">{avatar?<img src={avatar} alt="Shop preview" className="h-full w-full object-cover"/>:<RxAvatar size={30}/>}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#344338]">{avatar?"Image selected":"Upload your shop image"}</span><span className="mt-1 block text-xs text-[#89948c]">PNG, JPG or WebP · Choose a clear square image</span></span>
                  <FiUploadCloud className="shrink-0 text-[#315c46]" size={20}/>
                  <input id="shop-avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileInputChange} className="sr-only"/>
                </label>
              </div>

              <button type="submit" disabled={submitting} className="inline-flex h-13 min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#315c46] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(49,92,70,.18)] transition hover:-translate-y-0.5 hover:bg-[#244735] disabled:cursor-not-allowed disabled:opacity-60">{submitting?"Creating your shop…":"Create seller account"}<FiArrowRight/></button>
              <p className="text-center text-[11px] leading-5 text-[#98a199]">By creating a shop, you agree to provide accurate business information.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ShopCreate;
