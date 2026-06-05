import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../modules/products/products.service';
import { ProductsRepository } from '../modules/products/products.repository';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { BadRequestException } from '@nestjs/common';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: ProductsRepository;
  let shopsRepository: ShopsRepository;

  const mockProduct: ProductDTO = {
    id: 'product-uuid',
    name: 'Test Product',
    description: 'Description',
    price: 10,
    stockCount: 5,
    shopId: 'shop-uuid',
  };

  const mockShop = {
    id: 'shop-uuid',
    name: 'Test Shop',
  };

  const mockProductsRepository = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    delete: jest.fn().mockResolvedValue(undefined),
    findWithFilter: jest.fn().mockResolvedValue([mockProduct]),
    findByShopIds: jest.fn().mockResolvedValue([mockProduct]),
  };

  const mockShopsRepository = {
    findOne: jest.fn().mockResolvedValue(mockShop),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
        {
          provide: ShopsRepository,
          useValue: mockShopsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    shopsRepository = module.get<ShopsRepository>(ShopsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create when validation passes', async () => {
      mockShopsRepository.findOne.mockResolvedValueOnce(mockShop);
      const dto = {
        name: 'Test Product',
        description: 'Description',
        price: 10,
        stockCount: 5,
        shopId: 'shop-uuid',
      };
      const result = await service.create(dto);
      expect(shopsRepository.findOne).toHaveBeenCalledWith('shop-uuid');
      expect(productsRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException if stock count is less than 1', async () => {
      const dto = {
        name: 'Test Product',
        description: 'Description',
        price: 10,
        stockCount: 0,
        shopId: 'shop-uuid',
      };
      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('Stock count must be at least 1'),
      );
    });

    it('should throw BadRequestException if shop does not exist', async () => {
      mockShopsRepository.findOne.mockResolvedValueOnce(null);
      const dto = {
        name: 'Test Product',
        description: 'Description',
        price: 10,
        stockCount: 5,
        shopId: 'invalid-shop-uuid',
      };
      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('Shop not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should call repository.findAll', async () => {
      const result = await service.findAll('Test');
      expect(productsRepository.findAll).toHaveBeenCalledWith('Test');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne', async () => {
      const result = await service.findOne('product-uuid');
      expect(productsRepository.findOne).toHaveBeenCalledWith('product-uuid');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should check availability and call repository.update', async () => {
      mockShopsRepository.findOne.mockResolvedValueOnce(mockShop);
      const dto = { name: 'Updated Product', shopId: 'shop-uuid' };
      const result = await service.update('product-uuid', dto);
      expect(productsRepository.update).toHaveBeenCalledWith('product-uuid', dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('delete', () => {
    it('should call repository.delete', async () => {
      await service.delete('product-uuid');
      expect(productsRepository.delete).toHaveBeenCalledWith('product-uuid');
    });
  });
});
