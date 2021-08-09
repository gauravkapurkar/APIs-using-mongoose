const jwt = require('jsonwebtoken');
const Teacher = require('../Schemas/model');
const {ACCESS_TOKEN, ACCESS_TOKEN_TIME, REFRESH_TOKEN, REFRESH_TOKEN_TIME } = require('../configurations/config_local');

const redisClient = require('../database_connections/redis_conn');

const defaultExpiration = 180;

let isDeleted = false;
let isCreated = false;
let isUpdated = false;

function cacheIt(key, cb){
    return new Promise((resolve, reject)=>{
        redisClient.get(key, async (error, data) => {
            if(error) return reject(error);

            if(data && (isDeleted == false))
                if(isCreated == false)
                    if(isUpdated == false)
                        return resolve(JSON.parse(data));

            const newData = await cb();
            redisClient.setex(key, defaultExpiration, JSON.stringify(newData));
            isDeleted = false;
            isCreated = false;
            isUpdated = false;
            resolve(newData);
        })
    })
}


const getAllTeacher = async(req, res) => {
    try {
        const teachers = await cacheIt("teachers/getAllTeacher", async () => {
            const data = await Teacher.find();
            return data;
        })
        return res.status(200).json(teachers);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getTeacherById =  (req, res) => res.status(200).json(res.existTeacher);


const registerTeacher = async (req, res) => {
    
    const newTeacher = new Teacher({
        personalDetails: req.body.personalDetails,
        courseDetails: req.body.courseDetails,
        loginDetails: req.body.loginDetails
    })
    
    try {
        const saveTeacher = await newTeacher.save();
        isCreated = true;
        return res.status(201).json({result:saveTeacher, message:'Teacher created successfully'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


function generateRefreshToken(teacher_id){
    const refreshToken = jwt.sign({_id : teacher_id}, REFRESH_TOKEN, {expiresIn: REFRESH_TOKEN_TIME});
    // eslint-disable-next-line no-unused-vars
    // redisClient.get(teacher_id.toString(), (err, data) =>{
    //     if(err) throw err;
    //     redisClient.set(teacher_id.toString(), JSON.stringify({refreshToken}));
    // })
    return refreshToken;
}

const loginTeacherById = (req, res) => {
    if(!(req.body.username && req.body.password)) return res.status(400).json({message: 'enter username & password for login'}) ;

    if(!(res.existTeacher.loginDetails.username == req.body.username && res.existTeacher.loginDetails.password == req.body.password)){
        return res.status(401).json({message: 'Invalid credentials'});
    }

    const accessToken = jwt.sign({_id : res.existTeacher.id}, ACCESS_TOKEN, {expiresIn: ACCESS_TOKEN_TIME});
    const refreshToken = generateRefreshToken(res.existTeacher.id);

    return res.status(200).header('auth-token', accessToken).json({message: 'Teacher logged in successfully', data:{accessToken, refreshToken}});
}

const getAccessToken = (req, res) => {
    const teacherId = req.res.existTeacher.id;
    const accessToken = jwt.sign({_id : teacherId}, ACCESS_TOKEN, {expiresIn: ACCESS_TOKEN_TIME});
    const refreshToken = generateRefreshToken(teacherId);

    return res.status(200).header('auth-token', accessToken).json({message: 'Success', data:{accessToken, refreshToken}});
} 




const updateTeacherById = async (req, res) => {

    res.existTeacher.personalDetails.name = req.body.name;
    res.existTeacher.loginDetails.username = req.body.username;
    res.existTeacher.loginDetails.password = req.body.password;
    res.existTeacher.courseDetails.courses = req.body.courseDetails.courses;

    try {
        const updatedTeacher = await res.existTeacher.save();
        isUpdated = true;
        return res.status(200).json({result:updatedTeacher, message:'Teacher updated successfully'});
    } catch (error) {
        return res.status(500).json({message: error.message})      
    }
}

const deleteTeacher = async (req, res) => {
    try {
        await res.existTeacher.remove();
        isDeleted = true;
        return res.status(200).json({message: 'Teacher deleted successfully'});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {deleteTeacher, updateTeacherById, loginTeacherById, registerTeacher, getAllTeacher, getTeacherById, getAccessToken};

