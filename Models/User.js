const mongoose=require('mongoose');

const UserSchema = mongoose.Schema(
    {
        id: {
            type : String,
            required : false
        },
        FirstName: {
            type : String,
            required : true
        },
        LastName: {
            type : String,
            required : true
        },
        email: {
            type : String,
            required : true
        },
        password: {
            type : String,
            required : true
        },
        picture: {
            type : String,
            required : false
        },
        enabled: {
            type : Number,
            required : true
        },
        Created_date: {
            type : Date,
            default : Date.now()
        },
        Role: [String]
        ,
    }
);

module.exports=mongoose.model('User',UserSchema);
