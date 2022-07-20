const fs = require('fs');
const User = require('./../models/userModel');

exports.createUser = async (req: any, res: any) => {
  try {
    // method1: save method
    // const newUser = new User(req.body);
    // newUser.save();

    // method2: call the method directly
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
