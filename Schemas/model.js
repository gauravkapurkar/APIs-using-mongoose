const mongoose = require("mongoose");
const {AgeFromDateString} = require('age-calculator');

const teacherDetails = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Teacher name required'],
        minlength:[3,'Minimum name length 3 characters']
    },
    DOB:{
        type: Date,
        required: [true, 'Teacher Date of Birth required'],

    },
    isSeniorCitizen : {
        type: Boolean,
        // eslint-disable-next-line func-names
        // eslint-disable-next-line object-shorthand
        default : function(){
            // eslint-disable-next-line prefer-destructuring
            const age = new AgeFromDateString(this.DOB).age;
            if(age >= 55) return true;
            return false;
        },
        required:true
        
    },
})

const coursesTeach = new mongoose.Schema({
    courses :{
        type: [String], 
        required: [true, 'courses required']
    }
})

const credentials = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Teacher name required'],
        minlength:[3,'Minimum name length 3 characters'],
        unique : true
    },
    password:{
        type: String,
        rrequired: [true, 'password required'],
        minlength:[8,'Minimum password length 8 characters']
    }
})

const teacherSchema = new mongoose.Schema({
    personalDetails: teacherDetails,
    courseDetails: coursesTeach,
    loginDetails: credentials
});

module.exports = mongoose.model('teacher', teacherSchema);
