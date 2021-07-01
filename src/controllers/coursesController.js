const Courses  = require('../models/courses')


module.exports = {
    createOneCourse: async (req, res) => {
        const { nameCourse } = req.body;
        const newCourse = new Courses({ nameCourse });   
        await newCourse.save();
        return  res.status(201).json({
            succes:true,
            message:'crete curse successfully'
        });
      },
      
      updateOneCourse: async (req, res) => {
        const  {_id} = req.params;
        const { nameCourse  } = req.body;
        
        await Courses.findByIdAndUpdate(
          _id,
          {
            $set: { nameCourse },
          },
          { useFindAndModify: false }
        );
        return res.status(200).json({
            success:true,
            message:"modify successffully"
        })
      },

      deleteOneCourse: async (req, res) => {
        const { _id } = req.params;
        const removed = await Courses.findByIdAndDelete(_id);
        
        return res.status(200).json({
            succes:true,
            message:"deleted successffully"
        })
      },
      getAllCourses: async (req, res) => {
        const courses = await Courses.find().populate('teachers').exec((err,result)=>{
          return res.status(200).json({
              success:true,
              courses:result
          });
          
        }); 
      },
      assignTeacher: async (req, res, next) => {
        const _id = req.params.id;
        const { teachers } = req.body;
        
        
        const courseUpdated = await Courses.findByIdAndUpdate(
          _id,
          {
            $push: { teachers: teachers },
          },
          { useFindAndModify: false }
        ).populate('teachers').exec((err,result)=>{

          res.status(200).json({
            success:true,
            message:"asign Course  successffully",
            courseUpdated : result 
          })
        })
      }
}