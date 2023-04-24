const mongoose=require('mongoose');

const ConfigSchema = mongoose.Schema(
    {
        Name: {
            type : String,
            required : true
        },
        Created_date: {
            type : Date,
            default : Date.now()
        },
        Property: [String]
        ,
        Users: [String]
        ,
    }
);

module.exports=mongoose.model('Configuration',ConfigSchema);
