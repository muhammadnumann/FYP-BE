/* eslint no-param-reassign:0*/
import { Document, Schema } from 'mongoose';

export interface ITimeStampedDocument extends Document {
  /** Timestamp at creation in milliseconds */
  createdAt: number;
  /** Timestamp at updation in milliseconds */
  updatedAt: number;

  isDeleted: boolean;
}

const TimeStampPlugin = function <T>(schema: Schema<T>) {
  schema.add({ createdAt: { type: Number, index: true } });
  schema.add({ updatedAt: { type: Number, index: true } });
  schema.add({ isDeleted: { type: Boolean, index: true } });

  schema.pre<ITimeStampedDocument>('save', function (next) {
    if (this.isNew) {
      this.createdAt = new Date().getTime();
      this.isDeleted = false;
    }
    this.updatedAt = new Date().getTime();
    next();
  });
};

export default TimeStampPlugin;
