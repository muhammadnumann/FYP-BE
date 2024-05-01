import { Request, Response, response } from 'express';
import Credentials from '../../models/Credentials';
import Accounts from '../../models/Accounts';
import logger from '../../logger';
import bcryptjs from 'bcryptjs';


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
      const createdAccount = new Accounts({ accountName, phoneNo, age, credentialId: createdUser._id, gender })
      await createdAccount.save();

      logger.log({
        level: 'debug',
        message: 'User is successfully Added.',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: true,
        userId: createdUser._id,
        admin: createdAccount.toJSON(),
        message: 'User is successfully Added.'
      });
    }
  } catch (e) {
    logger.error({
      level: 'debug',
      message: `Internal Server Error occurred while adding a new adming  , ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error occurred while adding a new adming'
    });
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  console.log('Get all Account')
  try {
    const accounts = await Accounts.aggregate([{
      $lookup: {
        'from': 'credentials',
        'localField': 'credentialId',
        'foreignField': '_id',
        'as': 'credentialDetails'
      }
    },
    {
      "$project": {
        "_id": 1,
        "accountName": 1,
        "phoneNo": 1,
        "age": 1,
        "gender": 1,
        "credentialId": 1,
        "createdAt": 1,
        "updatedAt": 1,
        "credentialDetails.email": 1
      }
    }
    ])
    logger.log({
      level: 'debug',
      message: 'Getting all admins list.',
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(200).json({
      success: true,
      accounts
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

export const DeleteAccount = async (req: Request, res: Response) => {
  const { id } = req.body;

  console.log('Delete account')


  try {
    const del = await Accounts.deleteOne({ _id: id })
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
