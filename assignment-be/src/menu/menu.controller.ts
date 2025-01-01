import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { MenuItemResponseDto } from './menu.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Create a new menu item or submenu
  @Post()
  @ApiOperation({ summary: 'Create a new menu item or submenu' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created.',
    type: MenuItemResponseDto,
  })
  async create(@Body(ValidationPipe) createMenuDto: CreateMenuDto): Promise<MenuItemResponseDto> {
    return this.menuService.createMenu(createMenuDto);
  }

  // Get the menu hierarchy
  @Get()
  @ApiOperation({ summary: 'Get the menu hierarchy' })
  @ApiResponse({
    status: 200,
    description: 'The list of menu items and their hierarchy.',
    type: [MenuItemResponseDto],
  })
  async getMenuHierarchy(): Promise<MenuItemResponseDto[]> {
    return this.menuService.getMenuHierarchy();
  }

  // Update a menu item
  @Put(':id')
  @ApiOperation({ summary: 'Update a menu item by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the menu item to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully updated.',
    type: MenuItemResponseDto,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateMenuDto: UpdateMenuDto
  ): Promise<MenuItemResponseDto> {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  // Delete a menu item
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the menu item to delete',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'The menu item has been successfully deleted.',
  })
  async delete(@Param('id') id: number): Promise<void> {
    return this.menuService.deleteMenu(id);
  }
}
