import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import Credentials from '../../models/Credentials';
import logger from '../../logger';
import { createToken } from '../../helpers/jwt.helper';
import Accounts from '../../models/Accounts';
import AuditLogs from '../../models/audit-logs';

interface Userprops {
  _id: any
}
const getCredentialName = async ({ _id }: Userprops) => {

  const admin = await Accounts.findOne({ 'credentialId': _id })
  return admin

}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(req.body)
  try {
    const user = await Credentials.findOne({ email: email });
    if (!user) {
      logger.log({
        level: 'debug',
        message: 'Account Does Note Exist',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(404).json({
        success: false,
        message: 'Account Does Note Exist'
      });
    } else {
      const checkPassword = await bcryptjs.compare(password, user.password);
      if (!checkPassword) {
        logger.log({
          level: 'debug',
          message: "Password is Incorrect",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(404).json({
          success: false,
          message: "Password is Incorrect"
        });
      } else {
        const tokenObj = {
          uid: user.id,
        };
        const jwtToken = await createToken(tokenObj);
        const userDetail = await getCredentialName({ _id: user._id });
        logger.log({
          level: 'debug',
          message: 'Successfully Added',
          consoleLoggerOptions: { label: 'API' }
        });

        const Auditlog = new AuditLogs({ accountName: userDetail?.accountName, email: user.email, role: user.type, accountId: userDetail?._id })
        Auditlog.save()

        return res.status(200).json({
          success: true,
          accountData: { email: user.email, id: user._id, type: user.type, name: userDetail?.accountName, },
          userAuthToken: jwtToken,
          message: 'Successfully Login'
        });
      }
    }
  } catch (e) {
    logger.error({
      level: 'debug',
      message: `${'Signin Failure'} , ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: 'Signin Failure'
    });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  const { email, oldpassword, newPassword, confirmPassword } = req.body;

  console.log(req.body)

  if (newPassword !== confirmPassword) {
    logger.log({
      level: 'debug',
      message: "New Password and Confirm Password incorrect",
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(200).json({
      success: false,
      message: "New Password and Confirm Password incorrect"
    });
  }
  if (oldpassword === newPassword || oldpassword === confirmPassword) {
    logger.log({
      level: 'debug',
      message: "Old Password and New Password are same",
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(200).json({
      success: false,
      message: "Old Password and new Password are same"
    });
  }

  try {
    const user = await Credentials.findOne({ email: email });
    if (!user) {
      logger.log({
        level: 'debug',
        message: 'Account Does Note Exist',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: false,
        message: 'Account Does Note Exist'
      });
    } else {
      const checkPassword = await bcryptjs.compare(oldpassword, user.password);
      if (!checkPassword) {
        logger.log({
          level: 'debug',
          message: "Old Password is Incorrect",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: false,
          message: "old Password is Incorrect"
        });
      } else {

        const HASHED_PASSWORD = bcryptjs.hashSync(newPassword, 10);

        // create a filter for a movie to update
        const filter = { email };

        // create a document that sets the plot of the movie
        const updateDoc = {
          $set: {
            password: HASHED_PASSWORD
          },
        };

        await Credentials.updateOne(filter, updateDoc)

        const userDetail = await getCredentialName({ _id: user._id });
        logger.log({
          level: 'debug',
          message: 'Update Successfully',
          consoleLoggerOptions: { label: 'API' }
        });


        return res.status(200).json({
          success: true,
          accountData: { email: user.email, id: user._id, type: user.type, name: userDetail?.accountName, },
          message: 'Update Successfully'
        });
      }
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

export const forgetPassword = async (req: Request, res: Response) => {
  const { email, password, newPassword1 } = req.body;
  console.log(req.body)
  try {
    const user = await Credentials.findOne({ email: email });
    const HASHED_PASSWORD = bcryptjs.hashSync(password, 10);
    const filter = { email };
    const updateDoc = {
      $set: {
        password: HASHED_PASSWORD
      },
    };

    await Credentials.updateOne(filter, updateDoc)

    const userDetail = await getCredentialName({ _id: user?._id });
    logger.log({
      level: 'debug',
      message: 'Update Successfully',
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(200).json({
      success: true,
      accountData: { email: user?.email, id: user?._id, type: user?.type, name: userDetail?.accountName, },
      message: 'Update Successfully'
    });
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