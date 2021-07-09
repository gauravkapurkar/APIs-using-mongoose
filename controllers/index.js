const teacher = require('../Schemas/model');

const getAllTeacher = async(req, res) => {
    try {
        const teachers = await teacher.find();
        return res.status(200).json(teachers);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getTeacherById =  (req, res) => {
    return res.status(200).json(res.existTeacher);
}

const registerTeacher = async (req, res) => {
    const newTeacher = new teacher({
        personalDetails: req.body.personalDetails,
        courseDetails: req.body.courseDetails,
        loginDetails: req.body.loginDetails
    })

    try {
        const saveTeacher = await newTeacher.save();
        return res.status(201).json({result:saveTeacher, message:'Teacher created successfully'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

const loginTeacherById = (req, res) => {
    if(!(req.body.username && req.body.password)) return res.status(400).json({message: 'enter username & password for login'}) ;
    if(res.existTeacher.loginDetails.username == req.body.username && res.existTeacher.loginDetails.password == req.body.password){
        return res.status(200).json({message: 'Teacher logged in successfully'});
    }
    return res.status(401).json({message: 'Invalid credentials'});
}

const updateTeacherById = async (req, res) => {

    res.existTeacher.personalDetails.name = req.body.name;
    res.existTeacher.loginDetails.username = req.body.username;
    res.existTeacher.loginDetails.password = req.body.password;
    res.existTeacher.courseDetails.courses = req.body.courseDetails.courses;

    try {
        const updatedTeacher = await res.existTeacher.save();
        return res.status(200).json({result:updatedTeacher, message:'Teacher updated successfully'});
    } catch (error) {
        return res.status(500).json({message: error.message})      
    }
}

const deleteTeacher = async (req, res) => {
    try {
        await res.existTeacher.remove();
        return res.status(200).json({message: 'Teacher deleted successfully'});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {deleteTeacher, updateTeacherById, loginTeacherById, registerTeacher, getAllTeacher, getTeacherById};



