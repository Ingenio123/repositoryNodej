const {Schema, model} = require('mongoose')

const schemaRoles = new Schema({
    name:{
        type:String
    }
},{versionKey:false})

module.exports =  model("Role",schemaRoles);
