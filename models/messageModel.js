import mongoose from 'mongoose';
//creating message schema
const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default message;
