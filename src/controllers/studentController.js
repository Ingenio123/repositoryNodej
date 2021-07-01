const Student = require('../models/student')
const  User  = require('../models/user')
module.exports = {
    getAll: async (req,res,next)=>{
        const students = await  Student.find({},{__v:0}).sort({age: -1}).populate('courses');
        return  res.status(200).json({
            success:true,
            students
        })
    },
    createOneStudent: async (req,res,next)=>{
        const _id = req.id;
        const {NumberCellPhone} = req.body;

        const user = await User.findById(_id).select('-password');

        const {username,email,your_lenguage,age} = user;
        if(!username || !age || !NumberCellPhone || !your_lenguage || !email ) return res.status(400).json({success:false,message:'data incompleted '});
        
        const newStudent  = new Student({
            email,
            username,
            age,
            NumberCellPhone,
            your_lenguage
        });
        console.log('new Students =>' + newStudent)
        await newStudent.save();
        return res.status(200).json({
            success:true,
            message:'user Created sucessfully',
        })
    }
    
}