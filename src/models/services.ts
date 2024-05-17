import { Schema, model } from 'mongoose';
import TimeStampPlugin, { ITimeStampedDocument } from './plugins/timestamp-plugin';

export interface Iservices extends ITimeStampedDocument {
  /** Name of the BLog Title */
  orignalFileName: string;
  fileName: string;
}
const schema = new Schema<Iservices>({
  orignalFileName: { type: String },
  fileName: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "credentials", required: true }
});

schema.plugin(TimeStampPlugin);

const Services = model<Iservices>('tbl-services', schema);

export default Services