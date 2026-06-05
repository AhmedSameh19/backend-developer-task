import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from '../modules/shops/shops.service';
import { ShopsRepository } from '../modules/shops/shops.repository';
import { ProductsService } from 'src/modules/products/products.service';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

describe('ShopsService', () => {
  let service: ShopsService;
  let repository: ShopsRepository;
  let productsService: ProductsService;

  const mockShop: ShopDTO = {
    id: 'shop-uuid',
    name: 'Test Shop',
    openingHour: new Date('2026-01-01T08:00:00Z'),
    closingHour: new Date('2026-01-01T20:00:00Z'),
    availability: 'open',
  };

  const mockProduct: ProductDTO = {
    id: 'product-uuid',
    name: 'Test Product',
    description: 'Description',
    price: 10,
    stockCount: 5,
    shopId: 'shop-uuid',
  };

  const mockShopsRepository = {
    create: jest.fn().mockResolvedValue(mockShop),
    findAll: jest.fn().mockResolvedValue([mockShop]),
    findOne: jest.fn().mockResolvedValue(mockShop),
    update: jest.fn().mockResolvedValue(mockShop),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockProductsService = {
    findByShopIds: jest.fn().mockResolvedValue([mockProduct]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopsService,
        {
          provide: ShopsRepository,
          useValue: mockShopsRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<ShopsService>(ShopsService);
    repository = module.get<ShopsRepository>(ShopsRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create', async () => {
      const dto = {
        name: 'Test Shop',
        openingHour: new Date('2026-01-01T08:00:00Z'),
        closingHour: new Date('2026-01-01T20:00:00Z'),
        availability: 'open',
      };
      const result = await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockShop);
    });
  });

  describe('findAll', () => {
    it('should call repository.findAll', async () => {
      const result = await service.findAll();
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockShop]);
    });
  });

  describe('findAllWithProducts', () => {
    it('should call repository.findAll and productsService.findByShopIds and map correctly', async () => {
      const result = await service.findAllWithProducts();
      expect(repository.findAll).toHaveBeenCalled();
      expect(productsService.findByShopIds).toHaveBeenCalledWith(['shop-uuid']);
      expect(result).toEqual([
        {
          ...mockShop,
          products: [mockProduct],
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne', async () => {
      const result = await service.findOne('shop-uuid');
      expect(repository.findOne).toHaveBeenCalledWith('shop-uuid');
      expect(result).toEqual(mockShop);
    });
  });

  describe('update', () => {
    it('should call repository.update', async () => {
      const dto = { name: 'Updated Name' };
      const result = await service.update('shop-uuid', dto);
      expect(repository.update).toHaveBeenCalledWith('shop-uuid', dto);
      expect(result).toEqual(mockShop);
    });
  });

  describe('delete', () => {
    it('should call repository.delete', async () => {
      await service.delete('shop-uuid');
      expect(repository.delete).toHaveBeenCalledWith('shop-uuid');
    });
  });
});
