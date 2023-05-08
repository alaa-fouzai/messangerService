const { ObjectId } = require('mongoose');
const mongoose=require('mongoose');

const ConversationSchema = mongoose.Schema(
    {
        id: {
            type : String,
            required : false
        },
        Name: {
            type : String,
            required : true
        },
        email: {
            type : String,
            required : true
        },
        adminId:[Object],
        Created_date: {
            type : Date,
            default : Date.now()
        },
        ParentChatId:{
            type : String,
            required : true
        },
        state : {
            type :Boolean,
            default:true
        },
        Property:{
            type : String,
            required : false
        }
        ,
        texts: [Object]
    }
);

module.exports=mongoose.model('Conversations',ConversationSchema);
