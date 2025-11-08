import mongoose, { Document, Schema } from 'mongoose';

export type BlockType =
  | 'text'
  | 'heading'
  | 'list'
  | 'todo'
  | 'image'
  | 'code'
  | 'quote'
  | 'divider';

export interface IBlock extends Document {
  type: BlockType;
  content: string;
  pageId: mongoose.Types.ObjectId;
  order: number;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<IBlock>(
  {
    type: {
      type: String,
      enum: [
        'text',
        'heading',
        'list',
        'todo',
        'image',
        'code',
        'quote',
        'divider',
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
      default: '',
    },
    pageId: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient ordering
blockSchema.index({ pageId: 1, order: 1 });

export default mongoose.model<IBlock>('Block', blockSchema);
