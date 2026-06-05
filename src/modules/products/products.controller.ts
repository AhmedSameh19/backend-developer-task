import { Controller, Post, Body, Get, Query, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly service: ProductsService,
    ) { }

    @Post()
    async create(@Body() createProductDto: CreateProductDTO): Promise<ProductDTO> {
        return this.service.create(createProductDto);
    }

    @Get()
    async findAll(@Query('name') name?: string): Promise<ProductDTO[]> {
        return this.service.findAll(name);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ProductDTO | null> {
        return this.service.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDTO,
    ): Promise<ProductDTO> {
        return this.service.update(id, updateProductDto);
    }
}
