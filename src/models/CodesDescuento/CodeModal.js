const {Schema,model} = require('mongoose')

const CodeModel = new Schema({
    Codeval:{
        type:String,
        unique:true
    },
    Valor:{
        type:String,
    }
});

module.exports  = model('Code_Desc',CodeModel);

