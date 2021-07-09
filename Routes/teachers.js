const express = require('express');
const router = express.Router();
const {deleteTeacher, updateTeacherById, loginTeacherById, registerTeacher, getAllTeacher, getTeacherById} = require('../controllers/index');
const teacher = require('../Schemas/model');

//middleware for checking is teacher with param id is exist or not
async function isTeacher(req,res,next) {
    let existTeacher
    try {
        existTeacher = await teacher.findById(req.params.id);
        if(!existTeacher) return res.status(404).json({message: 'Teacher not found'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

    res.existTeacher = existTeacher;
    next();
}

//middleware for checking required fields are available or not
async function isCourses(req,res,next) {
    if(!(req.body.courseDetails.courses)) return res.status(400).json({message:'please enter courses'});
    else if(!(req.body.courseDetails.courses.length > 0)) return res.status(400).json({message:'please enter at least course'});
    next();
}



router.get('/', getAllTeacher)

router.get('/:id', isTeacher, getTeacherById)

router.post('/register', isCourses, registerTeacher)

router.post('/login/:id', isTeacher, loginTeacherById)

router.put('/update/:id', [isTeacher, isCourses], updateTeacherById)

router.delete('/delete/:id',isTeacher, deleteTeacher)

module.exports = router;