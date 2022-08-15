import db from '../../../lib/db';
import User from '../../../models/userModel';

//create User
async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();
    try {
      const blockUser = await User.findOneAndUpdate(
        { email: req.body.blockedUserEmail },
        { $push: { memebers: req.body.blockerEmail } },
        function (error, success) {
          if (error) {
            res.status(500).json({ msg: 'something went went wrong' + error });
          } else {
            res.status(200).json(success);
          }
        }
      );
      res.status(200).json(blockUser);
    } catch (err) {
      res.status(500).json(err);
    }
    await db.disconnect();

    // res.status(200).json(findUser);
  }
}

export default handler;
