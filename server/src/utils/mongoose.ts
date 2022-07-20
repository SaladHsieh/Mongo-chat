import mongoose from 'mongoose';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './../../../.env') });

// mongoDB connection
const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((e) => console.log('MongoDB connection error: \n', e));
