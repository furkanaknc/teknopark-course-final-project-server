const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const{ courseGroup } = require('../enums/courseGroup');


const CourseSchema = new mongoose.Schema({
   company: {
        type:String,
        required:true
   },
   educator: {
     type: Schema.Types.ObjectId,
     ref: 'users' 
     },
   group:{
        type:String,
        enum:Object.keys(courseGroup).map((el)=>courseGroup[el]),
        default:courseGroup.IC_EGITIM,
   },
   name:{
        type:String,
        required:true
   },
   description:{
        type:String,
        maxlength: 255,
        default:'eğitim'
   },



})

module.exports = Course = mongoose.model('courses', CourseSchema);