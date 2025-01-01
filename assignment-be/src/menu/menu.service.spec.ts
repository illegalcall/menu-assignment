import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;
  let prismaService: PrismaService;

  // Mocked data
  const mockMenuItem = {
    id: 1,
    title: 'New Menu',
    position: 1,
    parentId: null, // parentId is null
    isMenu: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useValue: {
            menuItem: {
              findUnique: jest.fn().mockResolvedValue(mockMenuItem),  // Mocking findUnique
              create: jest.fn().mockResolvedValue(mockMenuItem),       // Mocking create
              update: jest.fn().mockResolvedValue({ ...mockMenuItem, title: 'Updated Menu' }), // Mocking update
              deleteMany: jest.fn().mockResolvedValue(undefined),     // Mocking deleteMany
              delete: jest.fn().mockResolvedValue(undefined),         // Mocking delete
              findMany: jest.fn().mockResolvedValue([mockMenuItem]),  // Mocking findMany
            },
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new menu item with parentId as null', async () => {
    const createMenuDto = {
      title: 'New Menu',
      position: 1,
      parentId: null, // parentId is explicitly set to null
    };
    const result = await service.createMenu(createMenuDto);
    expect(result).toEqual(mockMenuItem);  // Ensure it matches the mocked return value
    expect(prismaService.menuItem.create).toHaveBeenCalledWith({
      data: {
        ...createMenuDto,
        parentId: null, // Ensure parentId is set to null
        isMenu: true,   // Ensure isMenu is set correctly
      },
    });
  });

  it('should create a new menu item without parentId', async () => {
    const createMenuDto = {
      title: 'New Menu',
      position: 1,
      // parentId is not provided
    };
    const result = await service.createMenu(createMenuDto);
    expect(result).toEqual(mockMenuItem);  // Ensure it matches the mocked return value
    expect(prismaService.menuItem.create).toHaveBeenCalledWith({
      data: {
        ...createMenuDto,
        parentId: null, // Ensure parentId is set to null
        isMenu: true,   // Ensure isMenu is set correctly
      },
    });
  });

  it('should throw NotFoundException if parent does not exist', async () => {
    const createMenuDto = {
      title: 'New Menu',
      position: 1,
      parentId: 999, // Non-existent parent
    };
    (prismaService.menuItem.findUnique as jest.Mock).mockResolvedValue(null); // Explicitly mock findUnique
    await expect(service.createMenu(createMenuDto)).rejects.toThrow(NotFoundException);
  });

  it('should update a menu item', async () => {
    const updateMenuDto = {
      title: 'Updated Menu',
    };
    const result = await service.updateMenu(1, updateMenuDto);
    expect(result.title).toBe('Updated Menu');
    expect(prismaService.menuItem.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateMenuDto,
    });
  });

  it('should throw NotFoundException if menu item does not exist during update', async () => {
    (prismaService.menuItem.findUnique as jest.Mock).mockResolvedValue(null); // Explicitly mock findUnique
    const updateMenuDto = {
      title: 'Updated Menu',
    };
    await expect(service.updateMenu(999, updateMenuDto)).rejects.toThrow(NotFoundException);
  });

  it('should delete a menu item', async () => {
    const result = await service.deleteMenu(1);
    expect(result).toBeUndefined();
    expect(prismaService.menuItem.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException if menu item does not exist during delete', async () => {
    (prismaService.menuItem.findUnique as jest.Mock).mockResolvedValue(null); // Explicitly mock findUnique
    await expect(service.deleteMenu(999)).rejects.toThrow(NotFoundException);
  });

  it('should get the entire menu hierarchy', async () => {
    const result = await service.getMenuHierarchy();
    expect(result).toEqual([mockMenuItem]);  // Ensure it matches the mocked result
  });
});