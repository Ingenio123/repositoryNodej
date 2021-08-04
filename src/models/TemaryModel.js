const {Schema, model}  = require('mongoose')

const TemaryScheme =  new Schema({
    name_level:{
        type:String,
        required:true,
    },
    sublevel:[{
        name_sublevel:{
            type:String,
            required:true
        },
        content:[{
            item:{type:String}
        }],
        exam:{
            type:String,
        }
    }
    ]
})

module.exports =  model("Temary",TemaryScheme)