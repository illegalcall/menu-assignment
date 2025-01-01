// components/AddSubmenu.tsx
import React from 'react';
import { MenuItem } from '@/app/page';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useMenuOperations } from '@/app/operations/useMenuOperations';

interface AddSubmenuProps {
  submenuParent: MenuItem;
  onClose: () => void;
  fetchMenuItems: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const AddSubmenu: React.FC<AddSubmenuProps> = ({ submenuParent, onClose, fetchMenuItems }) => {
  const { handleAddSubmenu, loading } = useMenuOperations();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleAddSubmenu(submenuParent, values.title, fetchMenuItems);
    onClose(); // Close the form after submission
  };

  return (
    <div className="p-2 w-80">
      <div className='mb-3'>
        <h5 className="font-semibold text-gray-600">Menu ID</h5>
        <input
          type="text"
          value={submenuParent?.id}
          readOnly
          className="w-full p-3 mt-1 border-0 rounded-lg focus:outline-none "
        />
      </div>
      <div className='mb-3'>
        <h5 className="font-semibold text-gray-600">Depth</h5>
        <input
          type="text"
          value={submenuParent.position}
          readOnly
          className="w-full p-3 mt-1 border-0  rounded-lg focus:outline-none "
        />
      </div>
      <div className='mb-3'>
        <h5 className="font-semibold text-gray-600">Parent Data</h5>
        <input
          type="text"
          value={submenuParent?.title}
          readOnly
          className="w-full p-3 mt-1 border-0  rounded-lg focus:outline-none "
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-48 p-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddSubmenu;