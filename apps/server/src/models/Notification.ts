import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  type: 'mention' | 'share' | 'comment' | 'system';
  message: string;
  link?: string;
  userId: mongoose.Types.ObjectId; // recipient
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['mention', 'share', 'comment', 'system'],
      default: 'system',
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
