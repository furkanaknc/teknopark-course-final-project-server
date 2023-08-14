const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {payrollType} = require('../enums/payroll');
const {userRole} =require ('../enums/user');
const Course =require('./Course');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
        // set: (email) => _.toLower(email),
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
     role:{
         type:String,
         enum:Object.keys(userRole).map((el)=>userRole[el]),
         default:userRole.ORDINARY_USER
     },
     departmentName:{
         type:String,
         default:"No department"
     },
     departmentCode:{
         type:Number,
         default: 0
     },
     registrationNumber:{
         type:Number,
         required:true
     },
     birthday: {
         type: Date, 
         required: true,
      
     },
     identidyNumber:{
         type:Number,
         unique:true,
         required:true
     },
     dayOfStartedToWork: {
         type: Date, 
         required:true,
         default: Date.now
     },
     dayOfLeftToWork: {
         type: Date,
         
     },
     payroll:{
         type:String,
         enum:Object.values(payrollType),
         default:Object.values(payrollType)[0],
     },
     wage:{
         type:Number,
         default: 11402
     },
     lawNo:{
         type:Number,
         default:1
     },
     courses: [
         {
           type: Schema.Types.ObjectId,
           ref: 'courses',
         },
       ],

})

module.exports = User = mongoose.model('users', UserSchema);