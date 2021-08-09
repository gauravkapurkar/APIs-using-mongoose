const teacher = require('../../../Schemas/model');

// middleware for checking is teacher with param id is exist or not
async function isTeacher(req,res,next) {
    let existTeacher
    try {
        // const existTeacher = await cacheIt(`teachers:${req.params.id}`, async () => {
        // const data = await teacher.findById(req.params.id);
        // return data;
        existTeacher = await teacher.findById(req.params.id);
        if(!existTeacher) return res.status(404).json({message: 'Teacher not found'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

    res.existTeacher = existTeacher;
    next();
}

module.exports = {isTeacher};
