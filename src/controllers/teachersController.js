const Teachers =  require('../models/teachers')
const Courses = require('../models/courses')

const path = require('path')
const {remove} = require('fs-extra')
const {uploader} = require('cloudinary').v2


module.exports = {
    getAllTeachers: async (req, res) => {
        const teachers = await Teachers.find().populate('flags');
        return res.status(200).json({
            success:true,
            teachers
        })
      },
    createOne: async (req,res,next)=>{
        const {firstName, lastName,description,graduated,age,eslogan} = req.body;
        
        const {imageTeacher } = req.files;

        if(!imageTeacher) return res.status(401).json({
            success:false,
            message:"img not found "
        })
        
        const result = await uploader.upload(imageTeacher.tempFilePath);
        // result.secure_url 
        const newTeachers =  new Teachers({
            firstName,
            lastName,
            description,
            graduated,
            eslogan,
            age,
            public_id: result.public_id,
            imageUrl:result.secure_url 
        })
        await newTeachers.save();
        await remove(path.resolve('./tmp'))

        return res.status(201).json({
            success:true,
            message:"Teachers created successfully!"
        })
    },
    updateTeachersData: async (req,res,next)=>{
        const _id = req.params.id;
        const {firstName,lastName,description,graduated,age,eslogan,profesionalBackround,Interests} = req.body;

        await Teachers.findByIdAndUpdate(_id,{
            $set:{firstName,lastName,description,graduated,age,eslogan,profesionalBackround,Interests}
        },{
            useFindAndModify:false
        });
        await remove(path.resolve('./tmp'))

        return res.status(200).json({
            success:true,
            message:'modify successfully',
        })

    },
    updateImgProfile: async (req,res,next)=>{
        const _id = req.params.id;
        const {imageTeacher } = req.files;

        if(!imageTeacher) return res.stus(401).json({succes:false, message:'img not foud :( '})
        
        const publicId = await Teachers.findById(_id);

        // eliminar una img de cloudinary  
        await uploader.destroy(publicId.public_id);

        const result = await uploader.upload(imageTeacher.tempFilePath);

        await Teachers.findByIdAndUpdate(_id, {

            $set: { 
                public_id: result.public_id,
                imageUrl: result.secure_url
            }

        },{
            useFindAndModify:false
        });

        await remove(path.resolve('./tmp'))
        
        return res.status(200).json({
            succes:true,
            message:' image modify successfully'
        })
    },
    getTeacherId:async (req,res,next)=>{
        const {id} = req.params;
        const teacherId =  await Teachers.findById(id).populate('flags');
        
        return res.status(200).json({
            success:true,
            teacher: teacherId
        })
    },
    getCourses: async (req,res,next)=>{
        const {name} = req.query;
        
        const course = await  Courses.find({teachers:{ $not: { $size: 0 }}}).populate({path:'teachers', match:{ firstName: name } })
        const teacherCourse =  course.filter((courses)=> courses.teachers.length > 0);
        return res.status(200).json({
            success:true,
            message:"course succeffully",
            courses:teacherCourse
        })
    },
    addFlagtoTeachers: async (req,res,next)=>{
        const {_id} = req.params;
        const {FlagId} = req.body;

        await Teachers.findByIdAndUpdate(_id,{
            $push:{flags: FlagId }
        },{
            useFindAndModify: false 
        }).populate('flags').exec((err,result)=>{

            res.status(200).json({
                success:true,
                message:"asign Flag  successffully",
                courseUpdated : result
              })
        })
    },
    teacherReview : (req,res,next)=>{

        return res.status(200).json({
            success:true,
            message:'successfully reviewed from the teacher'
        })
    }
}