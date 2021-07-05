const express = require('express');
const router = express.Router();
const model = require('./model');
const teacher = require('./model');

//middleware for checking is teacher with param id is exist or not
async function isTeacher(req,res,next) {
    let existTeacher
    try {
        existTeacher = await teacher.findById(req.params.id);
        if(!existTeacher) return res.status(404).json({message: 'Teacher not found'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    res.existTeacher = existTeacher;
    next();
}

router.get('/', async(req, res) => {
    try {
        const teachers = await teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/:id', isTeacher, (req, res) => {
    res.status(200).send(res.existTeacher.name);
})

router.post('/register', async (req, res) => {
    const newTeacher = new teacher({
        name: req.body.name,
        password: req.body.password
    })

    try {
        const saveTeacher = await newTeacher.save();
        res.status(201).json(saveTeacher);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/login/:id', isTeacher, (req, res) => {
    if(!(req.body.name && req.body.password)) return res.status(400).json({message: 'enter name & password for login'}) ;
    if(res.existTeacher.name == req.body.name && res.existTeacher.password == req.body.password){
        return res.status(200).json({message: 'Teacher logged in successfully'});
    }
    return res.status(401).json({message: 'Invalid credentials'});
})

router.put('/update/:id', isTeacher, async (req, res) => {
    if(!(req.body.name && req.body.password)) return res.status(400).json({message: 'enter name & password fields'}) ;
    res.existTeacher.name = req.body.name;
    res.existTeacher.password = req.body.password;

    try {
        const updatedTeacher = await res.existTeacher.save();
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({message: error.message})      
    }
})

router.delete('/delete/:id',isTeacher, async (req, res) => {
    try {
        await res.existTeacher.remove();
        res.status(200).json({message: 'Teacher deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


module.exports = router;