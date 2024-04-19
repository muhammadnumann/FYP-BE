import {
  Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
  ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface ICredentials extends ITimeStampedDocument {
  /** Name of the user */
  email: string;
  /** Secret Password */
  password: string;
  /** Type of authentication method */
  type: string,
  /** resetPasswordToken */
  resetPasswordToken: string;
  /** resetPasswordExpires */
  resetPasswordExpires: Number;

}

interface ICredentialsModel extends Model<ICredentials> { }

const schema = new Schema<ICredentials>({
  email: { type: String, index: true, required: true },
  password: { type: String, required: true },
  type: {
    type: String, required: true, default: "user", enum: ["admin", "user"]
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Credentials: ICredentialsModel = model<ICredentials, ICredentialsModel>('tbl-credentials', schema);

export default Credentials;
