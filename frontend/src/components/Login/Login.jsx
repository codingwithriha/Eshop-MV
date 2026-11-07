import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai";
import {FiArrowLeft,FiArrowRight,FiLock,FiMail,FiShoppingBag,FiShield} from "react-icons/fi";
import axios from "axios";
import {server} from "../../server";
import {toast} from "react-toastify";

const Login=()=>{
 const navigate=useNavigate();
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");
 const [visible,setVisible]=useState(false);const [loading,setLoading]=useState(false);
 const handleSubmit=async(e)=>{
  e.preventDefault();if(loading)return;setLoading(true);
  try{await axios.post(`${server}/user/login-user`,{email,password},{withCredentials:true});toast.success("Welcome back!");navigate("/",{replace:true});window.location.reload();}
  catch(error){toast.error(error.response?.data?.message||"We couldn't sign you in. Check your details and try again.");}
  finally{setLoading(false);}
 };
 const field="mt-2 h-12 w-full rounded-xl border border-[#e2e8e0] bg-[#fbfcfa] px-4 text-sm text-[#26352b] outline-none transition placeholder:text-[#a0aaa2] focus:border-[#315c46] focus:bg-white focus:ring-4 focus:ring-[#315c46]/[.07]";
 return <main className="min-h-screen bg-[#f5f7f3] px-4 py-8 sm:px-6 sm:py-12">
  <div className="mx-auto max-w-5xl"><Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#718076] hover:text-[#315c46]"><FiArrowLeft/> Back to marketplace</Link>
   <div className="mt-6 grid overflow-hidden rounded-[28px] border border-[#e5ebe3] bg-white shadow-[0_24px_80px_rgba(32,41,35,.08)] lg:grid-cols-[.9fr_1.1fr]">
    <section className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#20372a] p-8 text-white sm:p-10 lg:min-h-[620px] lg:p-12">
     <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10"/><div className="absolute -right-12 -top-8 h-48 w-48 rounded-full border border-white/10"/>
     <div className="relative"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9bd91] text-xl font-extrabold text-[#26372d]">E</span><p className="mt-12 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#d9bd91]">A better way to shop</p><h1 className="mt-4 max-w-sm font-display text-4xl font-extrabold leading-[1.08] tracking-[-.05em] sm:text-5xl">Good finds. Great days.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-white/65">Sign in to discover products, keep track of your orders and pick up right where you left off.</p></div>
     <div className="relative mt-10 flex items-center gap-3 border-t border-white/15 pt-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><FiShield className="text-[#d9bd91]"/></span><div><p className="text-xs font-bold">Your account, your marketplace</p><p className="mt-1 text-[11px] text-white/50">A simple, secure shopping experience</p></div></div>
    </section>
    <section className="flex items-center p-6 sm:p-10 lg:p-14"><div className="mx-auto w-full max-w-md">
     <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#66806e]">Welcome back</span><h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.04em] text-[#202923]">Sign in to your account</h2><p className="mt-2 text-sm leading-6 text-[#7b867e]">Enter your details below to continue.</p>
     <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div><label htmlFor="buyer-email" className="text-xs font-bold text-[#455349]">Email address</label><div className="relative"><FiMail className="absolute left-4 top-[26px] text-[#8b998e]"/><input id="buyer-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className={field+" pl-11"}/></div></div>
      <div><label htmlFor="buyer-password" className="text-xs font-bold text-[#455349]">Password</label><div className="relative"><FiLock className="absolute left-4 top-[26px] text-[#8b998e]"/><input id="buyer-password" type={visible?"text":"password"} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" className={field+" pl-11 pr-12"}/><button type="button" aria-label={visible?"Hide password":"Show password"} onClick={()=>setVisible(!visible)} className="absolute right-4 top-[25px] text-[#819087]">{visible?<AiOutlineEye size={19}/>:<AiOutlineEyeInvisible size={19}/>}</button></div></div>
      <div className="flex justify-end"><span className="text-xs text-[#9aa49c]">Forgot password? Contact support.</span></div>
      <button disabled={loading} className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#315c46] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(49,92,70,.18)] transition hover:-translate-y-0.5 hover:bg-[#244735] disabled:opacity-60">{loading?"Signing you in…":"Sign in"}<FiArrowRight/></button>
     </form>
     <p className="mt-7 text-center text-sm text-[#7b867e]">New to Eshop? <Link to="/signup" className="font-bold text-[#315c46] hover:text-[#244735]">Create an account</Link></p>
     <div className="mt-8 space-y-3 border-t border-[#edf0eb] pt-6 text-center"><Link to="/shop-login" className="inline-flex items-center gap-2 text-xs font-semibold text-[#7b867e] hover:text-[#315c46]"><FiShoppingBag/> Are you a seller? Sign in to your shop</Link><div><Link to="/admin-login" className="text-[11px] font-semibold text-[#9aa49c] hover:text-[#315c46]">Administrator sign in</Link></div></div>
    </div></section>
   </div>
  </div>
 </main>;
};
export default Login;
