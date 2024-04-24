import { Schema, model } from 'mongoose';
import TimeStampPlugin, { ITimeStampedDocument } from './plugins/timestamp-plugin';
import { ISection } from './section';

export interface Iservices extends ITimeStampedDocument {
  /** Name of the BLog Title */
  _doc: any;
  servicename: string;
  slug: string;
  sections: any[];
}
const schema = new Schema<Iservices>({
  servicename: { type: String, },
  slug: { type: String },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }]
});

schema.plugin(TimeStampPlugin);

const Services = model<Iservices>('tbl-services', schema);

export default Services;
