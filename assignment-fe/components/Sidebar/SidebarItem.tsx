import React, { useState } from "react";
import SidebarDropdown from "./SidebarDropdown";
import { Folder, ChevronDown, File } from "lucide-react"; // Import Lucide icons

interface Item {
  id: number;
  title: string;
  children?: Item[];
}

interface SidebarItemProps {
  item: Item;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    }
  };

  // Define a single background color for all items
  const defaultColor = "bg-gray-700"; // Single color for all items
  const openDropdownColor = "bg-green-600"; // Distinct color for open dropdown

  return (
    <li>
      <div
        className={`${defaultColor} ${
          isOpen ? openDropdownColor : ""
        } group relative flex items-center gap-2 rounded-sm px-2 py-2 font-medium text-white duration-300 ease-in-out cursor-pointer`}
        onClick={toggleDropdown}
      >
        {/* Icon for the menu item */}
        {item.children ? (
          <Folder className="w-4 h-4" /> // Folder icon for items with children
        ) : (
          <File className="w-4 h-4" /> // File icon for items without children
        )}
        <span className="text-sm">{item.title}</span>
        {/* Dropdown icon only for items with children */}
        {item.children && (
          <ChevronDown
            className={`w-4 h-4 ml-auto transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {item?.children && isOpen && (
        <div className="translate transform overflow-hidden">
          <SidebarDropdown items={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;