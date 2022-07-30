import db from '../../lib/db';
import conversation from '../../models/conversationModel';

//creating conversaton
async function handler(req, res) {
  if (req.method === 'POST') {
    // making connection to database
    await db.connect();
    const getConversation = await conversation.find({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (getConversation.length < 1) {
      const newConversation = new conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      try {
        const saveConversation = await newConversation.save();
        res.status(200).json(saveConversation);
      } catch (err) {
        res.status(500).json({ msg: `error processing your resquest ${err}` });
      }
    } else {
      res.status(200).json(getConversation);
    }
    // disconnection from database
    await db.disconnect();
  }
  //   getting conversation for a user
  else if (req.method === 'GET') {
    await db.connect();
    try {
      const getConversation = await conversation.find({
        members: { $in: [req.query.id] },
      });
      res.status(200).json(getConversation);
    } catch (err) {
      res.status(500).json(err);
    }
    await db.disconnect();
  }
}

export default handler;
