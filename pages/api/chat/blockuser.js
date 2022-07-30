import db from '../../../lib/db';
import User from '../../../models/userModel';

//create User
async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();
    console.log(req.body.email);
    const findUser = await User.find({
      email: req.body.email,
    });
    if (findUser.length > 0) {
      //   const newUser = new User(req.body);
      try {
        // const blockUser = findUser.blockedUsers.push(req.body.blockUser)
        const blockedUser = await User.updateOne(
          {
            _id: findUser._id,
          },
          {
            $push: {
              blockedUsers: req.body.blockUser,
            },
          }
        );
        // blockUser.save();
        res.status(200).json(blockedUser);
      } catch (err) {
        res.status(500).json(err);
      }
      await db.disconnect();
    }
    res.status(200).json(findUser);
  }
}

export default handler;
