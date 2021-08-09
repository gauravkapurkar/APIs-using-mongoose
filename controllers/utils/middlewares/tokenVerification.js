const jwt = require('jsonwebtoken');
// const redisClient = require('../../../database_connections/redis_conn');
const {ACCESS_TOKEN, REFRESH_TOKEN} = require('../../../configurations/config_local');

// eslint-disable-next-line func-names
function verifyAccessToken(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({message: 'Access Denied'});

    try{
        const verifiedToken = jwt.verify(token, ACCESS_TOKEN);
        req.res.existTeacher = verifiedToken;
        next();
    } catch(err){
        return res.status(400).json({message:'Invalid Token'});
    }
}

function verifyRefreshToken(req, res, next) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.body.token;
    if(!token) return res.status(401).json({message:'Access Denied'});
    try{
        const verifiedToken = jwt.verify(token, REFRESH_TOKEN);
        req.res.existTeacher = verifiedToken;
        // redisClient.get(verifiedToken.id.toString(), (err, data)=>{
        //     // console.log('redis')
        //     if(err) throw err;
        //     if(!data) return res.status(401).json({message: 'token not stored, Invalid request'});
        //     if(JSON.parse(data).token != token) return res.status(401).json({message: 'Invalid request'});
        // })
        next();
    } catch(err){
        return res.status(401).json({error: err, message:'Invalid Token'});
    }

}

module.exports = {verifyAccessToken,verifyRefreshToken};
