const User = require('../models/user')
const jwt =  require('jsonwebtoken')
const Role = require('../models/roles')




const registerUser = async  (req,res)=>{
    const {username,email,password,confirmPassword,your_lenguage,age} = req.body;
    
    
    if(!username || !email || !password || !confirmPassword || !your_lenguage || !age ){
        return res.status(401).json({
            message:"datos incompletos"
        });
    }

    const newUser = new User({
        username,
        email,
        password,
        your_lenguage,
        age
    })
    
    const role = await Role.findOne({ name: "user" })
    newUser.roles = [role._id];

    const userCreated = await newUser.save();

    const userData = {id:userCreated._id} 
    const token = await  jwt.sign( userData ,'secret',{ expiresIn: 60 * 60 * 24 });

    
    if(userCreated){
        const {_id,username,email,picture} = userCreated
        return res.status(200).json({
            success:true,
            token,
            user: {_id,picture,email,username}
        })  
    }

    return res.status(400).json({
        success:false,
        message: 'err SignUp'
    })
}

const signInUser =  async (req,res,next)=>{
    const {email,password} = req.body; 
    const user   = await User.findOne({email}).populate('roles');

    if(!user) return res.status(401).json({
        success:false,
        message: "user not foud, whit the given  email! "
    })
    

    const isMatch = await user.comparePassword(password);
    
    if(!isMatch) return res.status(400).json({success:true,message:"email / password doest not match!"})
    
    const userData = {id: user._id, email: user.email }
    
    const token = await  jwt.sign( userData ,'secret',{ expiresIn: 60 * 60 * 24 });
    const rol = user.roles[0].name;
    const {picture,_id,username,} = user;
    res.header('auth-token',token).json({
        success:true,
        error:null, 
        token,
        user: {_id,picture,rol, username,email}
    })
};
const UserConRoles =  async (req,res,next)=>{
    const  {username,email,password,roles}  = req.body;
    
    const user = await User.findOne({email}).select('-password');
    if(user) return  res.status(400).json({succes:false,error:true,message:'your email already exists'})

    const newUser =  new User({
        username,
        email,
        password
    });
    if(roles){
        const foundRoles = await Role.find({name:{$in: roles }})
        newUser.roles = foundRoles.map(role => role._id);
    }else{
        const role  = await Role.findOne({name:"user"})
        newUser.roles = [role._id]
    }
    const result = await newUser.save()
    
    return res.status(200).json({
        sucess:true,
        error:null,
        message:'user created successfully'
    })
}

const UserId = async (req,res,next) =>{
    const {_id} = req.params;
    if(_id !== req.id) return res.status(400).json({success:false,message: 'error invalid token'})
    const result = await User.findById(_id).select('-password');
    const  {email,username,picture} = result;
    return res.status(200).json({
        success:true,
        email,
        username,
        picture
    })
}



module.exports = {
    registerUser,
    signInUser,
    UserId,
    UserConRoles
}
