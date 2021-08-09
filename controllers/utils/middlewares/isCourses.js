

//  middleware for checking required fields are available or not
async function isCourses(req,res,next) {
    if(!(req.body.courseDetails.courses)) return res.status(400).json({message:'please enter courses'});
    if(!(req.body.courseDetails.courses.length > 0)) return res.status(400).json({message:'please enter at least 1 course'});
    next();
}

module.exports = {isCourses};