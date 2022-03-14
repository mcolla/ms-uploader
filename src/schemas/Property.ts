import mongoose, { Document, Schema } from 'mongoose';

type Property = Document & {};

const PropertySchema = new Schema(
  {
    group: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Property>('Property', PropertySchema);
