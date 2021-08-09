const express = require('express');

const router = express.Router();
const {deleteTeacher, updateTeacherById, loginTeacherById, registerTeacher, getAllTeacher, getTeacherById, getAccessToken} = require('../controllers/index');

// middlewares
const {verifyAccessToken, verifyRefreshToken} = require('../controllers/utils/middlewares/tokenVerification');
const {isTeacher} = require('../controllers/utils/middlewares/isTeacher');
const {isCourses} = require('../controllers/utils/middlewares/isCourses');


router.get('/', verifyAccessToken, getAllTeacher);

router.get('/:id', [verifyAccessToken, isTeacher], getTeacherById);

router.post('/token', verifyRefreshToken, getAccessToken);

router.post('/register', isCourses, registerTeacher);

router.post('/login/:id', isTeacher, loginTeacherById);

router.put('/update/:id', [verifyAccessToken, isTeacher, isCourses], updateTeacherById);

router.delete('/delete/:id',[verifyAccessToken, isTeacher], deleteTeacher);

module.exports = router;