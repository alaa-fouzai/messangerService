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
const Chat = require('./Models/Chat.js');
const Conversations = require('./Models/Conversations.js');

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true , useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.json());

let Rooms=[];

io.on('connection', (socket) => {
    //console.log('a user connected');
    socket.on('create', function(room) {
      //console.log(room);
      //get old messages
      socket.join(room);
    });
    socket.on('clientEmit', function(chat) {
      //console.log(chat.message);
      //console.log(chat.email);
      //console.log(chat.name);
      //console.log(chat.chatID);
      //brodcast new massage
      //{ chatID : chatID ,message: 'azeaze', email: '', name: '' }
      socket.to(chat.chatID).emit('clientMessage', {message:chat.message,email:chat.email,name:chat.name});
      //save to DB
      try {
        saveClientMessage(chat.message,chat.chatID,chat.email,chat.name);
      } catch(e) {
        console.log("could not save message")
      }
      
    });

});
server.listen(4000, () => {
    console.log('listening on *:4000');
  });


async function saveClientMessage(message,chatID,email,name) {
  //let c = await Chat.findById(chatID);
  //console.log(chatID);
  let conv = await Conversations.find({"ParentChatId": chatID,"email":email,"Name":name})
  if (conv.length > 0) {
    //console.log(conv ," conv");
    conv[0].texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)})
    await conv[0].save({ timestamps: { createdAt: true, updatedAt: false } });
  } else {
    //new conversation
    //console.log(conv ," new conversation");
    let Nconv = new Conversations();
    Nconv.Name=name;
    Nconv.email=email;
    Nconv.ParentChatId=chatID;
    Nconv.texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)})
    await Nconv.save({ timestamps: { createdAt: true, updatedAt: false } });
    let x = await Chat.findById(chatID);
    x.messages.push({_id:Nconv._id,message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)})
    await x.save({ timestamps: { createdAt: true, updatedAt: false } });
  }
  //let x = await Chat.findById(chatID)
  //console.log(x);
  //c.messages.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)});
  //await c.save({ timestamps: { createdAt: true, updatedAt: false } });
}