import React, { useEffect } from 'react';
import { MenuItem } from '@/app/page';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL } from "@/consts"

interface UpdateMenuProps {
  itemForEdit: MenuItem;
  fetchMenuItems: () => void;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const UpdateMenu: React.FC<UpdateMenuProps> = ({ itemForEdit, fetchMenuItems, onClose }) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: itemForEdit.title,
    },
  });

  useEffect(() => {
    form.reset({ title: itemForEdit.title });
  }, [itemForEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.put(`${BASE_URL}/menu/${itemForEdit.id}`, {
        title: values.title,
      });
      toast({
        title: "Menu updated successfully",
        description: `The menu item "${response.data.title}" has been updated.`,
      });
      fetchMenuItems(); // Refresh the menu items
      onClose(); // Close the form
    } catch (error) {
      toast({
        title: "Error updating menu",
        description: "An error occurred while updating the menu item.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/menu/${itemForEdit.id}`);
      toast({
        title: "Menu deleted successfully",
        description: `The menu item "${itemForEdit.title}" has been deleted.`,
      });
      fetchMenuItems(); // Refresh the menu items
      onClose(); // Close the form
    } catch (error) {
      toast({
        title: "Error deleting menu",
        description: "An error occurred while deleting the menu item.",
      });
    }
  };

  return (
    <div className='w-80'>
      <h1 className="text-xl font-bold">Update Menu</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 space-y-4 p-2 rounded-lg ">
          {/* Read-only fields */}
          <div className='mb-3'>
            <h5 className="font-semibold text-gray-600">Menu ID</h5>
            <Input
              value={itemForEdit.id}
              readOnly
              className="w-full p-3 mt-1 border  rounded-lg focus:outline-none "
            />
          </div>
          <div className='mb-3'>
            <h5 className="font-semibold text-gray-600">Depth</h5>
            <Input
              value={itemForEdit.position}
              readOnly
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none "
            />
          </div>
          <div className='mb-3'>
            <h5 className="font-semibold text-gray-600">Parent Data</h5>
            <Input
              value={itemForEdit.parentId ? itemForEdit.parentId.toString() : "None"}
              readOnly
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none"
            />
          </div>

          {/* Editable field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <h5 className="font-semibold text-gray-600">Submenu Title</h5>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter submenu title"
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 rounded-2xl">
              Update Menu
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 rounded-2xl"
            >
              Delete
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 rounded-2xl"
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateMenu;