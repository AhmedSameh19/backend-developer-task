import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

@Injectable()
export class ShopsService {
  constructor(
    private readonly repository: ShopsRepository,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) { }

  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    return this.repository.create(shop);
  }

  async findAll(): Promise<ShopDTO[]> {
    return this.repository.findAll();
  }

  /**
   * This method finds all shops with their products
   * @returns All shops with their products
   */

  async findAllWithProducts(): Promise<ShopWithProductsDTO[]> {
    const shops = await this.repository.findAll();
    const shopIds = shops.map(shop => shop.id);
    const products = await this.productsService.findByShopIds(shopIds);

    const productsByShopMap = new Map<string, ProductDTO[]>();

    for (const product of products) {
      if (!productsByShopMap.has(product.shopId)) {
        productsByShopMap.set(product.shopId, []);
      }
      productsByShopMap.get(product.shopId).push(product);
    }

    return shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      openingHour: shop.openingHour,
      closingHour: shop.closingHour,
      availability: shop.availability,
      products: productsByShopMap.get(shop.id) || [],
    }));

  }

  async findOne(id: string): Promise<ShopDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {
    return this.repository.update(id, shop);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
