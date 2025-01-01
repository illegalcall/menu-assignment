"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Use `usePathname` for App Router
import { Folder, ChevronDown, LayoutGrid } from "lucide-react"; // Import Lucide icons

interface Item {
  id: number;
  title: string;
  path?: string; // Add a path property for routing
  children?: Item[];
}

interface SidebarItemProps {
  item: Item;
  level?: number; // Track the nesting level
  isFirstParent?: boolean; // Indicates if this is the first parent
  active: string; // Active state passed from parent
  setActive: (title: string) => void; // Function to update active state
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level = 0,
  isFirstParent = false,
  active,
  setActive,
}) => {
  const [isOpen, setIsOpen] = useState(isFirstParent);
  const pathname = usePathname(); // Get the current path in App Router

  const toggleDropdown = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    }
  };

  const levelColor = `bg-gray-${700 - level * 100}`;

  useEffect(() => {
    if (isFirstParent) {
      setIsOpen(true);
    }
  }, [isFirstParent]);

  return (
    <li>
      <div
        className={`${active === item.title ? "bg-blue-500" : ""} group relative flex items-center gap-2 px-2 py-2 font-medium text-white duration-300 ease-in-out cursor-pointer`}
        onClick={() => {
          toggleDropdown();
          setActive(item.title); // Update active state when clicked
        }}
      >
        {item.children && item.children.length <= 0 ? (
          <button className="flex items-center gap-2 w-full">
            <LayoutGrid size={16} />
            <span>{item.title}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Folder size={16} />
            <span>{item.title}</span>
          </div>
        )}
        {item.children && item.children.length > 0 && isOpen && (
          <ChevronDown
            size={16}
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>
      {item.children && isOpen && (
        <ul className={`${levelColor}`}>
          {item.children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              level={level + 1}
              isFirstParent={false}
              active={active} // Pass active state to children
              setActive={setActive} // Pass setActive function to children
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;