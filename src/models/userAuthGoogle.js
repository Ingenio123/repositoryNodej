const  {Schema,model} = require('mongoose');
const {genSalt,hash} = require('bcrypt')
const UserAuthGoogle = new Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
}) 

UserAuthGoogle.pre('save', async function(next){
    const user = this;
    if(!user.isModified("password")) return next();
    const salt = await genSalt(10);
    const hashPassword  = await hash(user.password, salt);
    user.password = hashPassword ;
    next();
})

UserAuthGoogle.methods.comparePassword = async function(password){
    return await compare(password,this.password)
}

module.exports = model('GoogleAuthUser', UserAuthGoogle);
