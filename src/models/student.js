const { Schema, model } = require('mongoose')

const PayCourseSchema = new Schema ({
  DatepayCourse: {
    type: Date,
    default: Date.now()
  },
  ExpiresCourse: {
    type: Date,
  },
  Courses:[{
    type: Schema.Types.ObjectId, ref: 'Courses'
  }]
});

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
      courses: [PayCourseSchema],
    },
    { timestamps: true }
  );
studentSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Student',studentSchema);

