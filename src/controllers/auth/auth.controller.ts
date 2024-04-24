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

  console.log("Login")
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
      const checkPassword = await bcryptjs.compare(password, user.password);
      if (!checkPassword) {
        logger.log({
          level: 'debug',
          message: "Password is Incorrect",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
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
          user: { email: user.email, id: user._id, type: user.type, name: userDetail?.accountName, },
          userAuthToken: jwtToken,
          message: 'Successfully Added'
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
