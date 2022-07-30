import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const conversation =
  mongoose.models.conversation ||
  mongoose.model('conversation', conversationSchema);
export default conversation;
