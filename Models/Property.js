const { ObjectId } = require('mongoose');
const mongoose=require('mongoose');

const PropertySchema = mongoose.Schema(
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
        state : {
            type :Boolean,
            default:true
        },
        Users: []
        ,
        Products:[]
    }
);

module.exports=mongoose.model('property',PropertySchema);
