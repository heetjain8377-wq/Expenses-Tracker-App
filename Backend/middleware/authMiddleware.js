const jwt = require("jsonwebtoken");                                                                                                  


async function authMiddleware(req,res,next){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(404).json({
                message : "Token not found"
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : error.message
        })
    }
};

module.exports = authMiddleware;