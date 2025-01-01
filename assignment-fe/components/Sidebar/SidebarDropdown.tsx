import React from "react";
import SidebarItem from "./SidebarItem";

interface Item {
  id: number;
  title: string;
  children?: Item[];
}

interface SidebarDropdownProps {
  items: Item[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ items}) => {
  return (
    <ul className="mb-2 mt-2 flex flex-col gap-1">
      {items.map((item) => (
        <SidebarItem key={item.id} item={item}  />
      ))}
    </ul>
  );
};

export default SidebarDropdown;