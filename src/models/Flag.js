const { Schema, model } = require('mongoose');

const flagSchema = new Schema({
    nameFlag:{
        type:String,
    },
    urlFlag:{
        type:String,
    },
    public_id:{
        type:String
    },
    teachers:[{
        type:Schema.Types.ObjectId,
        ref:'Teachers'
    }]
})


module.exports =  model('Flag',flagSchema);