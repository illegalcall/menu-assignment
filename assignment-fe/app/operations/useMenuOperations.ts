// useMenuOperations.ts
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { MenuItem } from '@/app/page';

export const useMenuOperations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAddSubmenu = async (submenuParent: MenuItem, newTitle: string, fetchMenuItems: () => void) => {
    if (!submenuParent || !newTitle) return;

    const newSubmenu = {
      title: newTitle,
      parentId: submenuParent.id,
      position: submenuParent.position + 1,
      isMenu: false,
    };

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/menu", newSubmenu);
      fetchMenuItems();
      toast({
        title: "Submenu added successfully",
        description: response.data.title,
      });
    } catch (error) {
      toast({
        title: "Error adding submenu",
        description: "Adding error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenu = async (updatedItem: MenuItem, fetchMenuItems: () => void) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:4000/menu/${updatedItem.id}`, { title: updatedItem.title });
      fetchMenuItems();
      toast({
        title: "Menu updated successfully",
        description: response.data.title,
      });
    } catch (error) {
      toast({
        title: "Error updating menu",
        description: "Updateing error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (itemId: number, fetchMenuItems: () => void) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/menu/${itemId}`);
      fetchMenuItems();
      toast({
        title: "Menu deleted successfully",
        description: "The menu item has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting menu",
        description: "error deleing",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleAddSubmenu, handleUpdateMenu, handleDeleteMenu, loading };
};