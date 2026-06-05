import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../modules/products/products.controller';
import { ProductsService } from '../modules/products/products.service';
import { CreateProductDTO } from 'src/modules/products/dto/create-product.dto';
import { UpdateProductDTO } from 'src/modules/products/dto/update-product.dto';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: ProductDTO = {
    id: 'product-uuid',
    name: 'Test Product',
    description: 'Description',
    price: 10,
    stockCount: 5,
    shopId: 'shop-uuid',
  };

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call productsService.create and return the created product', async () => {
      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Description',
        price: 10,
        stockCount: 5,
        shopId: 'shop-uuid',
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should call productsService.findAll with name and return products', async () => {
      const result = await controller.findAll('Test');
      expect(service.findAll).toHaveBeenCalledWith('Test');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should call productsService.findOne and return product', async () => {
      const result = await controller.findOne('product-uuid');
      expect(service.findOne).toHaveBeenCalledWith('product-uuid');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should call productsService.update and return updated product', async () => {
      const dto: UpdateProductDTO = { name: 'Updated Product' };
      const result = await controller.update('product-uuid', dto);
      expect(service.update).toHaveBeenCalledWith('product-uuid', dto);
      expect(result).toEqual(mockProduct);
    });
  });
});
