import db from '../../../lib/db';
import User from '../../../models/userModel';

//saving user enail for later use
async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();
    // fetching email to check of it already exist
    const findUser = await User.find({
      email: req.body.email,
    });
    // if not save one and return it
    if (findUser.length < 1) {
      const newUser = new User(req.body);
      try {
        const saveUser = await newUser.save();
        res.status(200).json(saveUser);
      } catch (err) {
        res.status(500).json(err);
      }
      await db.disconnect();
    }
    res.status(200).json(findUser);
  }
}

export default handler;
