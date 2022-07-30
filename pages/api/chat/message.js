import db from '../../../lib/db';
import Message from '../../../models/messageModel';

//creating message for a user
async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();
    const newMassage = new Message(req.body);
    try {
      const saveMessage = await newMassage.save();
      res.status(200).json(saveMessage);
    } catch (err) {
      res.status(500).json(err);
    }
    await db.disconnect();
  }
  //get all messages for a user
  else if (req.method === 'GET') {
    await db.connect();
    try {
      const conversation = await Message.find({
        conversationId: req.query.id,
      });
      !conversation && res.status(400).json('No messages found for this user');
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
    await db.disconnect();
  }
}

export default handler;
