const express = require('express');
require('dotenv/config');
const app = express();
var jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const server = require('http').createServer(app);
var cors = require('cors')
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
const bodyParser= require('body-parser');


mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true , useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.json());


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("myevent", (data) => {
        console.log(data);
    });
  });
server.listen(4000, () => {
    console.log('listening on *:4000');
  });