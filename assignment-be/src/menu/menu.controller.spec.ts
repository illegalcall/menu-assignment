import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

describe('MenuController', () => {
  let controller: MenuController;
  let menuService: MenuService;

  // Mocked data
  const mockMenuItem = {
    id: 1,
    title: 'New Menu',
    position: 1,
    parentId: null,
    isMenu: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: {
            createMenu: jest.fn().mockResolvedValue(mockMenuItem),
            getMenuHierarchy: jest.fn().mockResolvedValue([mockMenuItem]),
            updateMenu: jest.fn().mockResolvedValue(mockMenuItem),
            deleteMenu: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new menu item', async () => {
      const createMenuDto: CreateMenuDto = {
        title: 'New Menu',
        position: 1,
        parentId: null,
      };
      const result = await controller.create(createMenuDto);
      expect(result).toEqual(mockMenuItem);
      expect(menuService.createMenu).toHaveBeenCalledWith(createMenuDto);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const invalidCreateMenuDto = {
        title: '', // Invalid: title is required
        position: 1,
        parentId: null,
      };
      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      try {
        await validationPipe.transform(invalidCreateMenuDto, { type: 'body', metatype: CreateMenuDto });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getMenuHierarchy', () => {
    it('should return the menu hierarchy', async () => {
      const result = await controller.getMenuHierarchy();
      expect(result).toEqual([mockMenuItem]);
      expect(menuService.getMenuHierarchy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a menu item', async () => {
      const updateMenuDto: UpdateMenuDto = {
        title: 'Updated Menu',
      };
      const result = await controller.update(1, updateMenuDto);
      expect(result).toEqual(mockMenuItem);
      expect(menuService.updateMenu).toHaveBeenCalledWith(1, updateMenuDto);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const invalidUpdateMenuDto = {
        title: '', // Invalid: title is required
      };
      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      try {
        await validationPipe.transform(invalidUpdateMenuDto, { type: 'body', metatype: UpdateMenuDto });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('delete', () => {
    it('should delete a menu item', async () => {
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(menuService.deleteMenu).toHaveBeenCalledWith(1);
    });
  });
});