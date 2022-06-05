import mongoose from 'mongoose';
const mongooseConnection = mongoose.connection;
const host: string = process.env.DB_HOST!;
const port: string = process.env.DB_PORT!;
const database: string = process.env.DB_DATABASE!;

mongooseConnection.on('error', (error) => {
  console.error('MongoDB connection error: \n', error);
});

mongooseConnection.on('open', () => console.log('Connected to MongoDB!!'));

mongoose.connect(`mongodb://${host}:${port}/${database}`);
