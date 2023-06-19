const jwt = require("jsonwebtoken");

module.exports =  function auth(req,res,next){
    let token;
    try {
        token = req.session.auth["accessToken"];
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const payload = jwt.verify(token, "access_token_secret");
        next();
    } catch(err){
        return res.status(500).json({message: "Error in processing token"});
    }
}