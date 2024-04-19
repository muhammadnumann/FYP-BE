import { USER_TYPE } from './../constants';
import { verifyToken } from '../helpers/jwt.helper';
import { Request, Response } from 'express';
import HttpStatus from 'http-status';
import Admin from '../models/Accounts'
import Credentials from '../models/Credentials'


export async function isAuthorized(req: Request, res: Response, next: () => void) {
  console.log("is Autherized")
  // comment added
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken: any = await verifyToken(token);
      if (decodedToken) {
        const credentials = await Credentials.findOne({ _id: decodedToken.uid });
        if (!credentials) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
        res.locals.credentials = credentials;
        let user;
        if (credentials.type === USER_TYPE.USER_TYPE_ADMIN || credentials.type === USER_TYPE.USER_TYPE) {
          user = await Admin.findOne({ credentialId: credentials._id })
        } else {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
        if (!user) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
        res.locals.user = user;
        return next();
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ authorization: [{ message: 'Unauthorized' }] });
      }
    } catch (err) {
      console.error('auth middleware', err);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ authorization: [{ message: err ? err : 'Unauthorized' }] });
    }
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ authorization: [{ message: 'Unauthorized' }] });
  }
}

export async function isAdmin(req: Request, res: Response, next: () => void) {
  console.log("is admin")

  if (req.headers.authorization) {

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken: any = await verifyToken(token);
      if (decodedToken) {
        const credentials = await Credentials.findOne({ _id: decodedToken.uid });
        if (!credentials) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
        if (credentials.type === USER_TYPE.USER_TYPE_ADMIN) {
          return next();
        } else {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ authorization: [{ message: 'Unauthorized' }] });
      }
    } catch (err) {
      console.error('auth middleware', err);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ authorization: [{ message: err ? err : 'Unauthorized' }] });
    }
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ authorization: [{ message: 'Unauthorized' }] });
  }
}
