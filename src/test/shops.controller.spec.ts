import { Test, TestingModule } from '@nestjs/testing';
import { ShopsController } from '../modules/shops/shops.controller';
import { ShopsService } from '../modules/shops/shops.service';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';

describe('ShopsController', () => {
  let controller: ShopsController;
  let service: ShopsService;

  const mockShop: ShopDTO = {
    id: 'shop-uuid',
    name: 'Test Shop',
    openingHour: new Date('2026-01-01T08:00:00Z'),
    closingHour: new Date('2026-01-01T20:00:00Z'),
    availability: 'open',
  };

  const mockShopWithProducts: ShopWithProductsDTO = {
    ...mockShop,
    products: [],
  };

  const mockShopsService = {
    create: jest.fn().mockResolvedValue(mockShop),
    findAll: jest.fn().mockResolvedValue([mockShop]),
    findAllWithProducts: jest.fn().mockResolvedValue([mockShopWithProducts]),
    findOne: jest.fn().mockResolvedValue(mockShop),
    update: jest.fn().mockResolvedValue(mockShop),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsController],
      providers: [
        {
          provide: ShopsService,
          useValue: mockShopsService,
        },
      ],
    }).compile();

    controller = module.get<ShopsController>(ShopsController);
    service = module.get<ShopsService>(ShopsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call shopsService.create and return the created shop', async () => {
      const dto: CreateShopDTO = {
        name: 'Test Shop',
        openingHour: new Date('2026-01-01T08:00:00Z'),
        closingHour: new Date('2026-01-01T20:00:00Z'),
        availability: 'open',
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockShop);
    });
  });

  describe('findAll', () => {
    it('should call shopsService.findAll and return shops', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockShop]);
    });
  });

  describe('findAllWithProducts', () => {
    it('should call shopsService.findAllWithProducts and return shops with products', async () => {
      const result = await controller.findAllWithProducts();
      expect(service.findAllWithProducts).toHaveBeenCalled();
      expect(result).toEqual([mockShopWithProducts]);
    });
  });

  describe('findOne', () => {
    it('should call shopsService.findOne and return a shop', async () => {
      const result = await controller.findOne('shop-uuid');
      expect(service.findOne).toHaveBeenCalledWith('shop-uuid');
      expect(result).toEqual(mockShop);
    });
  });

  describe('update', () => {
    it('should call shopsService.update and return updated shop', async () => {
      const dto: UpdateShopDTO = { name: 'Updated Shop' };
      const result = await controller.update('shop-uuid', dto);
      expect(service.update).toHaveBeenCalledWith('shop-uuid', dto);
      expect(result).toEqual(mockShop);
    });
  });

  describe('delete', () => {
    it('should call shopsService.delete', async () => {
      await controller.delete('shop-uuid');
      expect(service.delete).toHaveBeenCalledWith('shop-uuid');
    });
  });
});
