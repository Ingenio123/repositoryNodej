const Flag = require('../models/Flag')

const path = require('path')
const {remove} = require('fs-extra')
const {uploader} = require('cloudinary').v2

module.exports = {
    createOneFlags: async (req,res,nex)=>{
        const {nameFlag} = req.body;
        const {FlagImage} = req.files;

        if(!FlagImage) return res.status(401).json({
            success:false,
            message:"img not found "
        })

        const result = await uploader.upload(FlagImage.tempFilePath);

        const newflagData = new Flag({
            nameFlag,
            urlFlag :  result.secure_url,
            public_id: result.public_id,
        })

        await newflagData.save();
        await remove(path.resolve('./tmp'))

        return res.status(201).json({
            succes:true,
            newflagData
        })

    },
    assignTeachertoFlag: async (req, res, next) => {
        const _id = req.params.id;
        const { teachers } = req.body;
        
        
        const courseUpdated = await Flag.findByIdAndUpdate(
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
      },
      deleteFlag: async (req,res,next)=>{
        const {_id} = req.params;
        const result  = await Flag.findByIdAndDelete(_id);
        // eliminar una img de cloudinary  
        await uploader.destroy(result.public_id);
        res.status(200).json({succes:true,message:'deleted successfully'})
      },
      getallFlags:async (req,res,next)=>{
        const data = await Flag.find().populate('teachers');
        res.status(200).json({
          success:true,
          data
        })
      }

}