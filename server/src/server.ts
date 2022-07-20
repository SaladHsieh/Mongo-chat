const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from './utils/users';
import './utils/mongoose';
import mongoose from 'mongoose';
import { createBuilderStatusReporter } from 'typescript';
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// mongoDB connection START
const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

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

const testUser = new Users({
  name: 'John',
  gender: 'male',
  description: 'Have a good day!',
});

testUser
  .save()
  .then((doc: any) => console.log(doc))
  .catch((err: any) => console.log(err));

// Set static folder
app.use(express.static(path.join(__dirname, '/../public')));

let getRoomUsersFn: any;

// Run when client connects
io.on('connection', (socket: any) => {
  socket.on(
    'joinRoom',
    ({ username, room }: { username: string; room: string }, cb: any): any => {
      const { err, user } = userJoin(socket.id, username, room);
      if (err) return cb(err);

      socket.join(user.room);

      // Emit to the single client
      socket.emit(
        'robot_message',
        formatMessage(username, 'Welcome to Chatroom!')
      );

      // Broadcast emit to everybody except the client
      socket.broadcast
        .to(user.room)
        .emit(
          'robot_message',
          formatMessage(username, `${username} has joined the chat`)
        );

      // Send users and room info
      getRoomUsersFn = () => {
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      };
      getRoomUsersFn();
      cb();
    }
  );
  // Listen for chatMessage from front-end
  socket.on('chatMessage', (msg: string) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when a client disconnects
  socket.on('disconnect', () => {
    const user: any = userLeave(socket.id);

    if (user) {
      // Emit to all the clients
      io.to(user.room).emit(
        'robot_message',
        formatMessage(user.username, `${user.username} has left the chat`)
      );

      getRoomUsersFn();
    }
  });
});

const PORT = process.env.NODE_LOCAL_PORT;

server.listen(
  PORT,
  // ping pong packet to check connection (remove the connection who closed the browser)
  {
    pingTimeout: 2000,
    pingInterval: 10000,
  },
  () => console.log(`Server running on port ${PORT}`)
);

// export {};
