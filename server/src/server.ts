const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const userRoute = require('./routes/userRoute');
import express, { json } from 'express';
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from './utils/users';
import './utils/mongoose';
require('dotenv').config({ path: path.join(__dirname, './../../.env') });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(json());

// Set static folder
app.use(express.static(path.join(__dirname, '/../public')));

app.use('/api/user', userRoute);

let getRoomUsersFn: any;

// Run when client connects
io.on('connection', (socket: any) => {
  socket.on(
    'joinRoom',
    ({ username, room }: { username: string; room: string }): any => {
      const user = userJoin(socket.id, username, room);

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
