import db from '../../lib/db';
import User from '../../models/userModel';

//create User
async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();
    console.log(req.body.email);
    const findUser = await User.find({
      email: req.body.email,
    });
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
