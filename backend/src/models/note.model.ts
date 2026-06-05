import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 20000 },
    shareType: { type: String, enum: ['ONE_TIME', 'TIME_BASED'], required: true },
    accessType: { type: String, enum: ['PUBLIC', 'PASSWORD_PROTECTED'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    shareToken: { type: String, required: true, unique: true, index: true },
    accessKey: { type: String, default: null },
    viewCount: { type: Number, default: 0, min: 0 },
    isRevoked: { type: Boolean, default: false },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

noteSchema.index({ createdAt: -1 });

export type Note = InferSchemaType<typeof noteSchema>;
export type NoteDocument = HydratedDocument<Note>;
export const Note = model('Note', noteSchema);
