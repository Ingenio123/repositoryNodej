const { Schema, model } = require('mongoose')

const studentSchema = new Schema(
    {
      username: { 
          type: String, required: true
         },
      age: {
           type: Number, required: true
         },
      updatedBy: {
        type: Schema.Types.ObjectId 
      },
      email:{
        type:String,
      },
      NumberCellPhone:{
        type:Number,
      },
      courses: [{
            type: Schema.Types.ObjectId, ref: 'Courses' 
      }],
    },
    { timestamps: true }
  );
studentSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Student',studentSchema);
  