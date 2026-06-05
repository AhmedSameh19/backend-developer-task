import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateProductDTO {
    @JoiSchema(Joi.string().optional())
    name?: string;

    @JoiSchema(Joi.string().optional())
    description?: string;

    @JoiSchema(Joi.number().optional())
    price?: number;

    @JoiSchema(Joi.number().optional())
    stockCount?: number;

    @JoiSchema(Joi.string().optional())
    shopId?: string;
}
