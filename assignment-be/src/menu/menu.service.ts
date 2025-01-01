import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { MenuItemResponseDto } from './menu.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Create a menu or submenu
  async createMenu(data: CreateMenuDto): Promise<MenuItemResponseDto> {
    // Check if parent exists (if provided)
    if (data.parentId) {
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent menu with id ${data.parentId} not found`);
      }

      // If parent exists and is not a menu, update it
      if (!parent.isMenu) {
        await this.prisma.menuItem.update({
          where: { id: data.parentId },
          data: { isMenu: true },
        });
      }
    }

    // Create the new menu item
    const newMenuItem = await this.prisma.menuItem.create({
      data: {
        title: data.title,
        position: data.position,
        parentId: data.parentId ?? null,
        isMenu: data.parentId ? false : true, // If parentId is provided, it's a submenu (isMenu = false)
      },
    });

    return this.formatMenuItemResponse(newMenuItem);
  }

  // Delete a menu and its children
  async deleteMenu(id: number): Promise<void> {
    // First, delete child menu items
    await this.prisma.menuItem.deleteMany({
      where: { parentId: id },
    });

    // Then, delete the parent menu item
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    await this.prisma.menuItem.delete({
      where: { id },
    });
  }

  // Get the entire menu hierarchy
  async getMenuHierarchy(): Promise<MenuItemResponseDto[]> {
    const items = await this.prisma.menuItem.findMany();
    return this.buildTree(items);
  }

  // Update a menu item
  async updateMenu(
    id: number,
    data: UpdateMenuDto,
  ): Promise<MenuItemResponseDto> {
    // Check if the menu item exists
    const existingMenuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingMenuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    // Update menu item
    const updatedMenuItem = await this.prisma.menuItem.update({
      where: { id },
      data: {
        title: data.title,
      },
    });

    return this.formatMenuItemResponse(updatedMenuItem);
  }

  // Helper method to build a tree from flat items
  private buildTree(items, parentId = null) {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...this.formatMenuItemResponse(item),
        children: this.buildTree(items, item.id),
      }));
  }

  // Format the menu item for the response
  private formatMenuItemResponse(item): MenuItemResponseDto {
    return {
      id: item.id,
      title: item.title,
      position: item.position,
      isMenu: item.isMenu,
      parentId: item.parentId, // Ensure parentId is included
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      children: item.children ? item.children : [],
    };
  }
}