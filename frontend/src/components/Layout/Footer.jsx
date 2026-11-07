import React from "react";
import { FaTwitter,FaFacebook,FaInstagram,FaGithub,FaLinkedin } from "react-icons/fa";
import { FiArrowUpRight,FiMail } from "react-icons/fi";
import { footerCompanyLinks,footerProductLinks,footerSupportLinks } from "../../static/data";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkGroups=[{title:"Discover",items:footerProductLinks},{title:"Marketplace",items:footerCompanyLinks},{title:"Help & support",items:footerSupportLinks}];
  return (
    <footer className="mt-16 bg-[#1f3026] text-white">
      <div className="store-section relative -top-8 overflow-hidden rounded-[26px] border border-white/70 bg-[#edf2eb] px-6 py-8 text-[#26372d] shadow-[0_18px_45px_rgba(0,0,0,.13)] sm:px-9 md:flex md:items-center md:justify-between md:gap-8">
        <div className="max-w-lg"><span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#54745e]"><span className="h-1.5 w-1.5 rounded-full bg-[#b89a69]"/> The Eshop edit</span><h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">A little inspiration, delivered.</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#69766d]">Be first to hear about fresh arrivals, special finds and upcoming marketplace events.</p></div>
        <form className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row md:mt-0" onSubmit={(e)=>e.preventDefault()}>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#d8e0d6] bg-white px-4 shadow-sm"><FiMail className="shrink-0 text-[#718276]"/><input type="email" aria-label="Email address" className="h-12 min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-[#9aa49c]" placeholder="Your email address"/></label>
          <button type="submit" className="h-12 rounded-2xl bg-[#315c46] px-7 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#244735]">Join</button>
        </form>
      </div>
      <div className="store-section grid gap-12 pb-12 pt-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div><Link to="/" className="inline-flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9bd91] font-display text-lg font-extrabold text-[#26372d]">E</span><span className="font-display text-xl font-extrabold tracking-tight">eshop<span className="text-[#d9bd91]">.</span></span></Link><p className="mt-5 max-w-xs text-sm leading-7 text-white/60">A multi-vendor marketplace bringing independent sellers and thoughtful product discovery together.</p><div className="mt-6 flex gap-2">
          {[[FaTwitter,"https://twitter.com/RihaShehzadi"],[FaGithub,"https://github.com/codingwithriha"],[FaInstagram,"https://instagram.com/riha_shahzadi"],[FaLinkedin,"https://linkedin.com/in/riha-shahzadi"],[FaFacebook,"https://facebook.com/100077588075894"]].map(([Icon,url],i)=><a key={i} href={url} target="_blank" rel="noreferrer" aria-label="Social profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#d9bd91] hover:bg-white/10 hover:text-[#d9bd91]"><Icon size={16}/></a>)}
        </div></div>
        {linkGroups.map(group=><div key={group.title}><h3 className="mb-5 font-display text-sm font-bold text-white">{group.title}</h3><ul className="space-y-3">{group.items?.map((item,index)=><li key={index}><Link to={item.link} className="inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-[#d9bd91]">{item.name}<FiArrowUpRight className="opacity-0 transition group-hover:opacity-100"/></Link></li>)}</ul></div>)}
      </div>
      <div className="border-t border-white/10"><div className="store-section flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Eshop-MV. All rights reserved.</span><span>Designed with care · Built for discovery</span></div></div>
    </footer>
  );
};
export default Footer;
