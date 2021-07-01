const {Schema, model}  = require('mongoose')

const newCourse =  new Schema({
    nameCourse:{
        type:String,
    },
    teachers:[{
        type:Schema.Types.ObjectId,
        ref:'Teachers'
    }]
},{
    timestamps:true
})
newCourse.plugin(require('mongoose-autopopulate'));

module.exports = model('Courses',newCourse)
