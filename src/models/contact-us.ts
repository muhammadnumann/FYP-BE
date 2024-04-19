import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IContactUs extends ITimeStampedDocument {
    firstName: string
    lastName: string
    massage: string
    phoneNo: string
    email: string
    visit: boolean
}

interface IContactUsModel extends Model<IContactUs> { }

const schema = new Schema<IContactUs>({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    massage: { type: String, require: true },
    phoneNo: { type: String, require: true },
    email: { type: String, require: true },
    visit: { type: Boolean, default: false },
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const ContactUs: IContactUsModel = model<IContactUs, IContactUsModel>('tbl-cntactus', schema);

export default ContactUs;