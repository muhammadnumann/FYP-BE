import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const signup = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: Joi.string().required().label('password'),
    accountName: Joi.string().label('accountName'),
    phoneNo: Joi.string().required().label('phoneNo'),
    age: Joi.string().required().label('age'),
    gender: Joi.string().required().label('gender'),
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
