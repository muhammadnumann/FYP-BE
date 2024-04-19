import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const signup = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: req.body.type == 'store' ? Joi.string().optional().label('password') : Joi.string().required().label('password'),
    storeInfo: req.body.type == 'store' ? Joi.object().required().label('storeInfo') : Joi.string().optional().label('storeInfo'),
    storeId: req.body.type == 'store' ? Joi.string().required().label('storeId') : Joi.string().optional().label('storeId'),
    type: Joi.string().required().label('type'),
    storeName: req.body.type === 'store' ? Joi.string().required().label('storeName') : Joi.string().optional().label('storeName'),
    adminName: req.body.type === 'admin' ? Joi.string().required().label('adminName') : Joi.string().optional().label('adminName'),
    ngoName: req.body.type === 'ngo' ? Joi.string().required().label('ngoName') : Joi.string().optional().label('ngoName'),
    description: req.body.type === 'ngo' ? Joi.string().required().label('description') : Joi.string().optional().label('description'),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

export const login = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: Joi.string().required().label('password')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}
