import {
  Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
  ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IAuditLogs extends ITimeStampedDocument {
  /** Name of the Account */
  accountName: string;
  /** role  */
  role: string;
  // Emails
  email: string
  // account Id
}

interface IAuditLogsModel extends Model<IAuditLogs> { }

const schema = new Schema<IAuditLogs>({
  accountName: { type: String, required: true },
  role: { type: String },
  email: { type: String, required: true },
  accountId: { type: String, required: true },
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const AuditLogs: IAuditLogsModel = model<IAuditLogs, IAuditLogsModel>('tbl-auditlogs', schema);

export default AuditLogs;
