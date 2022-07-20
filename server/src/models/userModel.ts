import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!'],
    unique: true,
  },
  gender: {
    type: String,
  },
  description: {
    type: String,
    required: false,
    default: 'hi everyone',
  },
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
