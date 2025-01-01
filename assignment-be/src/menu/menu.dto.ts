import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'The title of the menu item',
    example: 'Main Menu',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ID of the parent menu item (optional, used for submenus)',
    example: 1,
    required: false, // Optional property
  })
  @IsOptional() // Optional, used when creating submenus
  @IsInt()
  parentId?: number;

  @ApiProperty({
    description: 'The position of the menu item in the list',
    example: 1,
  })
  @IsInt()
  position: number;
}

export class UpdateMenuDto {
  @ApiProperty({
    description: 'The title of the menu item (optional)',
    example: 'Updated Menu',
    required: false, // Optional property
  })
  @IsOptional()  // Optional in case only `title` is being updated
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The position of the menu item (optional)',
    example: 2,
    required: false, // Optional property
  })
  @IsOptional()  // Optional in case position update is required
  @IsInt()
  position?: number;
}

export class MenuItemResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the menu item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the menu item',
    example: 'Main Menu',
  })
  title: string;

  @ApiProperty({
    description: 'The position of the menu item in the list',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Whether the menu item is a main menu or submenu',
    example: true,
  })
  isMenu: boolean;

  @ApiProperty({
    description: 'ID of the parent menu item (optional)',
    example: 1,
    required: false,
  })
  parentId?: number;

  @ApiProperty({
    description: 'Date when the menu item was created',
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the menu item was last updated',
    example: '2025-01-02T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Children menu items (if any)',
    type: [MenuItemResponseDto],
    required: false, // Optional, used for nested menus
  })
  children: MenuItemResponseDto[];
}
