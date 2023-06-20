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
/*
admin joins the chatbot room
admin listens on the chatbot room 
admin sends message to client with conversation id (not chatbot room)


client joins conversation id room
client sends messages on the chatbot room
client listens on conversation id room (not chatbot room)
*/
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('create', async function(room) {
      if(room.type === "client") {
        let conv = await Conversations.findOne({"email":room.email,"Name":room.name})
        // console.log(conv);
        if (conv._id !== null){
          socket.join(conv._id.toString());
        } else {
          //new conversation
        }
        
      } else if (room.type === "admin") {
        console.log("admin joined its own room :" + room.chatId);
        socket.join(room.chatId);
      } else {
        console.log("no room selected")
      }
      
      //change room id to conversation id
      
    });
    socket.on('clientEmit', async function(chat) {
      console.log('client Emit');
      //console.log(chat.email);
      //console.log(chat.name);
      //brodcast new massage
      //{ chatID : chatID ,message: 'azeaze', email: '', name: '' }
      
      //save to DB
      try {
        //save to db
        r = await saveClientMessage(chat.message,chat.chatID,chat.email,chat.name);
        //emit to admin
        socket.to(chat.chatID).emit('clientMessage', r);
      } catch(e) {
        console.log(e)
        console.log("clientEmit:could not save message")
      }
      
    });
    socket.on('AdminEmit', async function(chat) {
      try {
        //save to DB
        console.log("chat")
        console.log(chat)
        r = await saveAdminMessage(chat.message,chat.ConversationId,chat.email,chat.FirstName+" "+chat.LastName,chat.chatId);
        console.log("r");
        //console.log(r);
        //emit to client on ConversationId
        socket.to(chat.ConversationId).emit('AdminMessage', { message :chat.message , time:Math.floor(Date.now() / 1000), owner : "Admin",name:chat.FirstName+" "+chat.LastName});
      } catch(e) {
        console.log(e)
        console.log("AdminEmit:could not save message")
      }
      
    });

});
server.listen(4000, () => {
    console.log('listening on *:4000');
  });


async function saveClientMessage(message,chatID,email,name) {
  //let c = await Chat.findById(chatID);
  let conv = await Conversations.find({"ParentChatId": chatID,"email":email,"Name":name})
  if (conv.length > 0) {
    //console.log(conv ," conv");
    conv[0].texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,owner:"client",seen:false,timestamp:Math.floor(Date.now() / 1000)})
    r = await conv[0].save({ timestamps: { createdAt: true, updatedAt: false } });
    return r;
  } else {
    //new conversation
    //console.log(conv ," new conversation");
    let Nconv = new Conversations();
    Nconv.Name=name;
    Nconv.email=email;
    Nconv.ParentChatId=chatID;
    Nconv.texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)})
    r = await Nconv.save({ timestamps: { createdAt: true, updatedAt: false } });
    
    x = await Chat.findById(chatID);
    x.messages.push({_id:Nconv._id,message:message,email:email,name:name,owner:"client",seen:false,timestamp:Math.floor(Date.now() / 1000)})
    await x.save({ timestamps: { createdAt: true, updatedAt: false } });
    return r;
  }
  
}
async function saveAdminMessage(message,ConversationId,email,name,chatID) {
  //let c = await Chat.findById(chatID);
  console.log(message,ConversationId,email,name,chatID);
  let conv = await Conversations.find({"_id":ConversationId});
  console.log(conv);
  if (conv.length > 0) {
    //console.log(conv ," conv");
    conv[0].texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,owner:"Admin",seen:false,timestamp:Math.floor(Date.now() / 1000)})
    r = await conv[0].save({ timestamps: { createdAt: true, updatedAt: false } });
    return r;
  } else {
    //new conversation
    //console.log(conv ," new conversation");
    let Nconv = new Conversations();
    Nconv.Name=name;
    Nconv.email=email;
    Nconv.ParentChatId=chatID;
    Nconv.texts.push({_id:new mongoose.Types.ObjectId(),message:message,email:email,name:name,seen:false,timestamp:Math.floor(Date.now() / 1000)})
    r=await Nconv.save({ timestamps: { createdAt: true, updatedAt: false } });
    x = await Chat.findById(chatID);
    x.messages.push({_id:Nconv._id,message:message,email:email,name:name,owner:"Admin",seen:false,timestamp:Math.floor(Date.now() / 1000)})
    await x.save({ timestamps: { createdAt: true, updatedAt: false } });
    return r;
  }
}