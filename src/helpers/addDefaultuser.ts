import Credentials from '../models/Credentials';
import Accounts from '../models/Accounts';
import logger from '../logger';
import bcryptjs from 'bcryptjs';


export const addAdminCredentials = async () => {
    try {
        const saltRounds = 10;
        const { email, password, type, accountName, phoneNo, age, gender } = {
            email: 'admin@admin.com', password: '12345', type: 'admin',
            accountName: "Admin", phoneNo: '03244734494', age: 22, gender: "Male"
        };

        const HASHED_PASSWORD = bcryptjs.hashSync(password, saltRounds);


        const userCredential = await Credentials.findOne({ email });
        if (userCredential) {

        }
        else {
            const createdUser = new Credentials({ email, password: HASHED_PASSWORD, type })
            await createdUser.save();
            const createdAccount = new Accounts({ accountName, phoneNo, age, credentialId: createdUser._id, gender })
            await createdAccount.save();

            logger.log({
                level: 'debug',
                message: 'User is successfully Added.',
                consoleLoggerOptions: { label: 'API' }
            });
        }
    } catch (e) {
        logger.error({
            level: 'debug',
            message: `Internal Server Error occurred while adding a new adming  , ${e}`,
            consoleLoggerOptions: { label: 'API' }
        });
    }
};
