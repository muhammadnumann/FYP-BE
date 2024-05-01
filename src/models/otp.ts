import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IOtps extends ITimeStampedDocument {
    email: string;
    otp: string;
    account_id: string;
}

interface IOtpsModel extends Model<IOtps> { }

const schema = new Schema<IOtps>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    account_id: { require: true, type: Schema.Types.ObjectId },

});

schema.plugin(TimeStampPlugin);

const Otps: IOtpsModel = model<IOtps, IOtpsModel>('tbl-otps', schema);

export default Otps;
