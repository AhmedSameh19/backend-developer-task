import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { CreateProductDTO } from 'src/modules/products/dto/create-product.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { Inject, forwardRef } from '@nestjs/common';
import { UpdateProductDTO } from './dto/update-product.dto';
@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository,
    @Inject(forwardRef(() => ShopsRepository))
    private readonly shopRepository: ShopsRepository) { }

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }

  //We ensured that the shopID  is a valid shop and that the stock is greater than 0

  async create(product: CreateProductDTO): Promise<ProductDTO> {
    await this.checkAvailability(product);

    return this.repository.create(product);
  }

  async findAll(name?: string): Promise<ProductDTO[]> {
    return this.repository.findAll(name);
  }

  async findOne(id: string): Promise<ProductDTO | null> {
    return this.repository.findOne(id);
  }

  async update(id: string, product: UpdateProductDTO): Promise<ProductDTO> {

    await this.checkAvailability(product);

    return this.repository.update(id, product);
  }

  async delete(id: string): Promise<void> {

    return this.repository.delete(id);
  }

  // Helper function used in update and create to check on the stock and the shopID
  async checkAvailability(product: Partial<ProductDTO>): Promise<boolean> {

    if (product.stockCount !== undefined && product.stockCount < 1) {
      throw new BadRequestException('Stock count must be at least 1');
    }

    if (product.shopId) {
      const shop = await this.shopRepository.findOne(product.shopId);
      if (!shop) {
        throw new BadRequestException('Shop not found');
      }
    }

    return true;
  }

  async findByShopIds(shopIds: string[]): Promise<ProductDTO[]> {
    return this.repository.findByShopIds(shopIds);
  }
}
