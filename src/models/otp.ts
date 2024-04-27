import { Schema, model } from 'mongoose';

export interface IOTP {
    email: string,
    otp: string
}
const otpSchema = new Schema<IOTP>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
});

const Otps = model<IOTP>('otps', otpSchema);

export default Otps;
