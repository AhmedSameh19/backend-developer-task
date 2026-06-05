import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

const AVAILABILITY = ['busy', 'open', 'closed'];

export class UpdateShopDTO {
  @JoiSchema(Joi.string().optional())
  name?: string;

  @JoiSchema(Joi.date().optional())
  openingHour?: Date;

  @JoiSchema(Joi.date().optional())
  closingHour?: Date;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY)
      .optional(),
  )
  availability?: string;
}
