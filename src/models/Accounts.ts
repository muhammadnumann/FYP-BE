import {
  Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
  ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IAccounts extends ITimeStampedDocument {
  /** Name of the Admin */
  accountName: string;
  /** credentialId from Credentials collection */
  credentialId: Schema.Types.ObjectId;

  isDeleted: boolean;

}

interface IAccountsModel extends Model<IAccounts> { }

const schema = new Schema<IAccounts>({
  accountName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  credentialId: { type: Schema.Types.ObjectId, ref: "credentials", required: true },
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Accounts: IAccountsModel = model<IAccounts, IAccountsModel>('tbl-accounts', schema);

export default Accounts;
