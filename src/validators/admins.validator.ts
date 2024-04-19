import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const addAdmin = async (req: Request, res: Response, next: () => void) => {

  console.log("Add Admin")

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: Joi.string().required().label('password'),
    type: Joi.string().required().label('type'),
    adminName: Joi.string().required().label('adminName'),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}