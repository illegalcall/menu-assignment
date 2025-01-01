"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { ChevronRight, Folder, LayoutGrid, PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import UpdateMenu from "@/components/updateMenu"
import AddSubmenu from "@/components/AddSubmenu"
import Header from "@/components/Header"
import Sidebar from "../components/Sidebar"
import { BASE_URL } from "@/consts"
export interface MenuItem {
  id: number
  title: string
  parentId: number | null
  position: number
  isMenu: boolean
  createdAt: string
  updatedAt: string
  children: MenuItem[]
}

const Dashboard: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(new Set())
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)
  const [activeComponent, setActiveComponent] = useState<"update" | "add" | null>(null)
  const [submenuParent, setSubmenuParent] = useState<MenuItem | null>(null)
  const [itemForEdit, setItemForEdit] = useState<MenuItem | null>(null)
  const [expandAll, setExpandAll] = useState<boolean>(false)
  const { toast } = useToast()

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/menu`)
      setMenuItems(response.data)
    } catch (error) {
      toast({
        title: "Error fetching menu items",
        description: "We are facing an error in fetching the menu.",
      })
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedMenuIds((prev) => {
      const newExpandedMenuIds = new Set(prev)
      if (newExpandedMenuIds.has(id)) {
        newExpandedMenuIds.delete(id)
      } else {
        newExpandedMenuIds.add(id)
      }
      return newExpandedMenuIds
    })
  }

  const handleExpandCollapseAll = (expand: boolean) => {
    if (expand) {
      const allExpandedIds = expandAllMenuItems(menuItems)
      setExpandedMenuIds(allExpandedIds)
    } else {
      setExpandedMenuIds(new Set())
    }
    setExpandAll(expand)
  }

  const expandAllMenuItems = (menuItems: MenuItem[]) => {
    const allIds = new Set<number>()
    const addChildrenRecursively = (item: MenuItem) => {
      allIds.add(item.id)
      item.children.forEach(addChildrenRecursively)
    }
    menuItems.forEach(addChildrenRecursively)
    return allIds
  }

  const handleOpenUpdateMenu = (item: MenuItem) => {
    setItemForEdit(item)
    setActiveComponent("update")
  }

  const handleOpenAddSubmenu = (item: MenuItem) => {
    setSubmenuParent(item)
    setActiveComponent("add")
  }

  const handleCloseActiveComponent = () => {
    setActiveComponent(null)
    setItemForEdit(null)
    setSubmenuParent(null)
  }

  const renderMenu = (menu: MenuItem[], level: number = 0) => {
    return menu.map((item) => (
      <div key={item.id} className="menu-item relative">
        <div
          onClick={(e) => {
            e.stopPropagation()
            handleOpenUpdateMenu(item)
          }}
          onMouseOver={() => setHoveredItemId(item.id)}
          className={`flex items-center cursor-pointer mt-2 ${item.children.length <= 0 ? "pl-3" : ""}`}
          style={{ paddingLeft: `${level * 20}px` }} // Horizontal indentation
        >
          {/* Vertical lines and connectors */}
          {level > 0 && (
            <div
              className="absolute h-full w-px bg-gray-300"
              style={{
                left: `${level * 20 - 10}px`, // Position the vertical line
                top: 0,
              }}
            />
          )}

          {/* Horizontal line */}
          {level > 0 && (
            <div
              className="absolute w-2 h-px bg-gray-300"
              style={{
                left: `${level * 20 - 10}px`, // Position the horizontal line
                top: `10px`,
              }}
            />
          )}

          {/* Chevron button for expanding */}
          {item.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(item.id)
              }}
              className="ml-2 text-sm text-gray-500"
            >
              <ChevronRight
                className={`transform ${expandedMenuIds.has(item.id) ? "rotate-90" : ""}`}
              />
            </button>
          )}

          <span className="inline-block mr-2">{item.title}</span>

          {/* Add Submenu button */}
          {hoveredItemId === item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenAddSubmenu(item)
              }}
              className="ml-2 text-sm text-blue-500"
            >
              <PlusCircle />
            </button>
          )}
        </div>

        {/* Render children */}
        {expandedMenuIds.has(item.id) && item.children.length > 0 && (
          <div className="relative">
            {renderMenu(item.children, level + 1)} {/* Increase the level for children */}
          </div>
        )}
      </div>
    ))
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} menuItems={menuItems} />
        <div className="relative flex flex-1 flex-col lg:ml-72">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl px-4 md:px-4 2xl:px-4">
              <div className="px-0">
                <div className="flex py-2 items-center space-x-1 text-gray-600">
                  <Folder className="w-5 h-5" />
                  <span className="text-sm">/ Menu</span>
                </div>

                {/* Heading with icon */}
                <h1 className=" sm:text-2xl text-md font-bold flex items-center space-x-2 py-1">
                  <span className="bg-blue-600 p-2 rounded-full"><LayoutGrid className=" text-white w-5 h-5" /></span>
                  <span>MENU</span>
                </h1>
                <div className="w-96 md:w-60 my-5">
                  <select
                    className="form-select w-full p-2 border-0 rounded-lg focus:outline-none"
                    aria-label="Select Menu"
                    defaultValue="" // Use defaultValue instead of selected
                  >
                    <option value="" disabled>
                      system management
                    </option>
                  </select>

                </div>

                <div className="space-y-6">
                  <div className="space-y-4">

                    <div className="flex space-x-6  flex-wrap sm:flex-nowrap">
                      <div className="w-96 sm:w-1/2">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleExpandCollapseAll(true)}
                            className={`text-sm px-4 py-2 rounded-2xl outline-none transition-colors duration-300 ${expandAll ? "bg-black text-white border border-gray-600 shadow-md" : "bg-gray-100 text-black border border-gray-500"
                              }`}
                          >
                            Expand All
                          </button>
                          <button
                            onClick={() => handleExpandCollapseAll(false)}
                            className={`text-sm px-4 py-2 rounded-2xl outline-none transition-colors duration-300 ${!expandAll ? "bg-black text-white border border-gray-600 shadow-md" : "bg-gray-100 text-black border border-gray-500"
                              }`}
                          >
                            Collapse All
                          </button>
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Menu Items</h3>
                        <div>{renderMenu(menuItems)}</div>
                      </div>
                      <div className="w-96 sm:w-1/2 mt-8 sm:mt-0">
                        {activeComponent === "update" && itemForEdit && (
                          <UpdateMenu
                            itemForEdit={itemForEdit}
                            fetchMenuItems={fetchMenuItems}
                            onClose={handleCloseActiveComponent}
                          />
                        )}
                        {activeComponent === "add" && submenuParent && (
                          <AddSubmenu
                            submenuParent={submenuParent}
                            onClose={handleCloseActiveComponent}
                            fetchMenuItems={fetchMenuItems}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

    </>
  )
}

export default Dashboard