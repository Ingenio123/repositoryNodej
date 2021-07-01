const {Schema, model}  = require("mongoose")

const teachersSchema =  new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    eslogan:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    graduated:{
        type:String,
    },
    graduated:{
        types:String
    },
    age:{
        type:Number,
        required: true
    },
    public_id:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    profesionalBackround:{
        type:String,
    },
    Interests:{
        type:String
    },
    roles:[{
        type:Schema.Types.ObjectId,
        ref:'Role'
    }],
    flags:[{
        type:Schema.Types.ObjectId,
        ref:'Flag'
    }]
})
teachersSchema.plugin(require('mongoose-autopopulate'));
module.exports  = model("Teachers", teachersSchema)