"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "../ClickOutside";
import { X } from "lucide-react";
import { MenuItem } from "@/app/page";

interface SidebarProps {
  menuItems: MenuItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, menuItems }: SidebarProps) => {
  const [active, setActive] = useState<string>(""); // Manage active state globally

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed px-2 left-0 sm:left-5 rounded-2xl h-[94vh] top-5 z-9999 flex w-72 z-40 flex-col overflow-y-hidden bg-[#101828] duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 lg:py-3">
          <Link href="/">
            <h1 className="text-white font-bold">CLOIT</h1>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <X className="text-white font-bold" />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-2 py-4 lg:mt-2 lg:px-2">
            <ul className="mb-2 flex flex-col gap-1.5">
              {menuItems?.map((menuItem, menuIndex) => (
                <SidebarItem
                  key={menuItem.id} // Use menuItem.id as the key
                  item={menuItem} // Pass the menuItem as the item prop
                  isFirstParent={menuIndex === 1} // Expand the second item by default
                  active={active} // Pass active state as a prop
                  setActive={setActive} // Pass setActive function as a prop
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;