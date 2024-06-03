import { FindOne } from './../contactus/contactus.controller';
import { verifyToken } from "../../helpers/jwt.helper";
import Otps from "../../models/otp";
import Services from "../../models/services";
import Credentials from '../../models/Credentials';
import Accounts from '../../models/Accounts';




// Send OTP to the provided email
const GetDetail = async (req: any, res: any, next: any) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
            const decodedToken: any = await verifyToken(token);
            const userId: string = decodedToken?.uid;
            const isAdmin = await Credentials.findById(userId)

            if (isAdmin?.type === 'admin') {
                res.status(200).json({
                    success: true,
                    message: 'Fetch successfully',
                    data: {
                        all: (await Services.find()).length,
                        real: (await Services.find({ isReal: true })).length,
                        fake: (await Services.find({ isReal: false })).length,
                        deletedusers: (await Accounts.find({ isDeleted: true })).length,
                        totalusers: (await Accounts.find()).length
                    }
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Fetch successfully',
                    data: {
                        all: (await Services.find({ userId })).length,
                        real: (await Services.find({ userId, isReal: true })).length,
                        fake: (await Services.find({ userId, isReal: false })).length,
                    }
                });
            }

        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };
};

export { GetDetail }