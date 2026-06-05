import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateProductDTO {
    @JoiSchema(Joi.string().required())
    shopId: string;

    @JoiSchema(Joi.string().required())
    name: string;

    @JoiSchema(Joi.string().required())
    description: string;

    @JoiSchema(Joi.number().required())
    price: number;

    @JoiSchema(Joi.number().required())
    stockCount: number;
}
