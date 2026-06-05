import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateMemberDTO {
  @JoiSchema(Joi.string().required())
  firstName: string;

  @JoiSchema(Joi.string().required())
  lastName: string;

  @JoiSchema(Joi.string().valid('male', 'female').required())
  gender: string;

  @JoiSchema(Joi.string().required())
  dateOfBirth: string;

  @JoiSchema(Joi.string().optional())
  phone?: string;

  @JoiSchema(Joi.string().uuid().optional())
  centralMemberId?: string;

  @JoiSchema(Joi.string().optional())
  subscriptionDate?: string;
}
