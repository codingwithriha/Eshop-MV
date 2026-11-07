import React from "react";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <nav className="flex flex-col gap-1 800px:flex-row 800px:items-center 800px:gap-1">
      {navItems.map((item, index) => {
        const isActive = active === index + 1;
        return (
          <Link
            key={item.url || item.title}
            to={item.url}
            className={`rounded-full px-4 py-3 text-[14px] font-semibold transition-colors 800px:py-2.5 ${
              isActive
                ? "bg-[#e8eee8] text-[#315c46]"
                : "text-[#58645c] hover:bg-[#f0f3ef] hover:text-[#244735] 800px:text-white/85 800px:hover:bg-white/10 800px:hover:text-white"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
