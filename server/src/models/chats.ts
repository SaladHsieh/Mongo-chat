import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});
