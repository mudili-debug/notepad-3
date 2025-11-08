import mongoose, { Document, Schema } from 'mongoose';

export interface IPage extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  icon?: string;
  visibility: 'private' | 'shared';
  sharedWith: mongoose.Types.ObjectId[];
  status: 'active' | 'deleted';
  blocks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private',
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    blocks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Block',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPage>('Page', pageSchema);
