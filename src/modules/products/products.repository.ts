import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/modules/products/products.model';
import { Op } from 'sequelize';
@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) { }

  async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }

  async create(product: Partial<Product>): Promise<Product> {
    return this.productModel.create(product);
  }

  // Select * from products where name ilike '%name%';
  // Used ilike for case-senstive and %name% to match anywhere in the name
  async findAll(name?: string): Promise<Product[]> {
    const whereConditions: any = {};

    if (name) {
      whereConditions.name = {
        [Op.iLike]: `%${name}%`,
      };
    }
    return this.productModel.findAll({ where: whereConditions });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const result = await this.productModel.update(product, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  async findByShopIds(shopIds: string[]): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        shopId: {
          [Op.in]: shopIds,
        },
      },
    });
  }
}

