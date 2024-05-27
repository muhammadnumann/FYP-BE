import { Request, Response, response } from 'express';
import Credentials from '../../models/Credentials';
import Accounts from '../../models/Accounts';
import logger from '../../logger';
import bcryptjs from 'bcryptjs';
import { createToken, verifyToken } from '../../helpers/jwt.helper';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');


export const AddAccount = async (req: Request, res: Response) => {
  const { email, password, type, accountName, phoneNo, age, gender } = req.body;

  console.log(req.body)

  const saltRounds = 10;
  const HASHED_PASSWORD = bcryptjs.hashSync(password, saltRounds);

  try {
    const userCredential = await Credentials.findOne({ email: email });
    if (userCredential) {
      return res.status(200).json({
        success: false,
        message: 'Account Already Exist'
      });
    } else {
      const createdUser = new Credentials({ email, password: HASHED_PASSWORD, type })
      await createdUser.save();

      const update = await Accounts.updateOne(
        { email: email },
        {
          $set: {
            isDeleted: false,
            credentialId: createdUser._id
          }
        }
      )
      if (!update.nModified) {
        const createdAccount = new Accounts({ accountName, email, phoneNo, age, credentialId: createdUser._id, gender })
        await createdAccount.save();

        logger.log({
          level: 'debug',
          message: 'User is successfully Added.',
          consoleLoggerOptions: { label: 'API' }
        });
        const tokenObj = {
          uid: createdUser.id,
        };
        const jwtToken = await createToken(tokenObj);
        return res.status(200).json({
          success: true,
          accountData: { email: email, id: createdUser._id, type: createdUser.type, name: accountName, },
          userAuthToken: jwtToken,
          message: 'User is successfully Added.'
        });
      }
      logger.log({
        level: 'debug',
        message: 'User is successfully Added.',
        consoleLoggerOptions: { label: 'API' }
      });
      const tokenObj = {
        uid: createdUser.id,
      };
      const jwtToken = await createToken(tokenObj);
      return res.status(200).json({
        success: true,
        accountData: { email: email, id: createdUser._id, type: createdUser.type, name: accountName, },
        userAuthToken: jwtToken,
        message: 'User is successfully Added.'
      });
    }
  } catch (e) {
    logger.error({
      level: 'debug',
      message: `Internal Server Error occurred while adding a new admin  , ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error occurred while adding a new admin'
    });
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  console.log('Get all Account')

  const { pageNo, pageSize = 5 } = req.query;
  console.log(req.query)
  const skip = (Number(pageNo) - 1) * Number(pageSize);
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken: any = await verifyToken(token);


      const currentCredentialId = decodedToken.uid;
      const accounts = await Accounts.find({
        credentialId: { $ne: new mongoose.Types.ObjectId(currentCredentialId) },
        isDeleted: { $ne: true }
      }).skip(skip)
        .limit(Number(pageSize));
      ;
      logger.log({
        level: 'debug',
        message: 'Getting all admins list.',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: true,
        pageNo,
        pageSize,
        totalAccounts: (await Accounts.find({
          credentialId: { $ne: new mongoose.Types.ObjectId(currentCredentialId) },
          isDeleted: { $ne: true }
        })).length,

        accounts,
      });
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while Getting all admins list., ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while Getting all admins list.'
      });
    }
  };
}
export const DeleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log('Delete account')

  try {
    const account = await Accounts.updateOne(
      { credentialId: id },
      { $set: { isDeleted: true } }
    )
    console.log(account)
    // const del = await Accounts.deleteOne({ _id: id })
    const del = await Credentials.deleteOne({ _id: id })
    return res.status(200).json(
      del
    );
  } catch (error) {
    logger.error({
      level: 'debug',
      message: `${'Cant Find'} , ${error}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(404).json({
      success: false,
      message: 'Cant Find'
    });
  }
};
