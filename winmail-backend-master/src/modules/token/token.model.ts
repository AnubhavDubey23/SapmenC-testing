import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  token: string;
  user: Schema.Types.ObjectId;
}

const TokenSchema: Schema<IToken> = new Schema(
  {
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IToken>('Token', TokenSchema);
