const { ObjectId } = require('mongoose');
const mongoose=require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        id: {
            type : String,
            required : false
        },
        Name: {
            type : String,
            required : true
        },
        Created_date: {
            type : Date,
            default : Date.now()
        },
        Style: {
            type : String,
            required : true
        },
        Script:{
            type : String,
            required : true
        },
        state : {
            type :Boolean,
            default:true
        },
        Property:{
            type : String,
            required : true
        }
        ,
        chatBot: [String]
        ,
        messages: [Object]
        ,
        Users: [Object]
        ,
    }
);

module.exports=mongoose.model('Chat',ChatSchema);
