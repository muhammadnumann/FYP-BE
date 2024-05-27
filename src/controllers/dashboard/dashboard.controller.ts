import { verifyToken } from "../../helpers/jwt.helper";
import Otps from "../../models/otp";
import Services from "../../models/services";




// Send OTP to the provided email
const GetDetail = async (req: any, res: any, next: any) => {
    console.log("Dashboard Detail")
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken: any = await verifyToken(token);
            const userId: string = decodedToken?.uid;

            console.log(req.body)
            console.log((await Services.find({ userId, isReal: true })).length)
            res.status(200).json({
                success: true,
                message: 'Fetch successfully',
                data: {
                    all: (await Services.find({ userId })).length,
                    real: (await Services.find({ userId, isReal: true })).length,
                    fake: (await Services.find({ userId, isReal: false })).length,
                }
            });

        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };
};

export { GetDetail }