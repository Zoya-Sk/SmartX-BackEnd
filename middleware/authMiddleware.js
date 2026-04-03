const jwt = require("jsonwebtoken");

exports.checkAuth = async(req,res,next)=>{
    try {
        // fetch token 
        const token = req.headers.authorization;

        // validation
        if(!token || !token.startsWith("Bearer ")){
            return res.status(403).json({
                success:false,
                message:"Token is Missing Malformed!",
            })
        }

        const actualToken = token.split(" ")[1];
        const decoded = jwt.verify(actualToken,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Token is Invalid or Expired!",
        })
    }
}