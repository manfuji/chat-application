import mongoose from 'mongoose';
// creating channel for conversation
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
