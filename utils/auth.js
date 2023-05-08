
const jwt = require("jsonwebtoken");

exports.createJWT = (email, userId, duration) => {
    const payload = {
       email,
       userId,
       duration
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration,
    });
 };

exports.verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) return res.json({
                isLoggedIn: false,
                message: "Failed to Authenticate"
            })
            req.user = {};
            req.user.name = decoded.name;
            req.user.userId = decoded.userId;
            req.user.email = decoded.email
            next()
        })
    } else {
        console.log("\n\nUndefined Token\n\n", req.data)
        res.status(500).json({message: "No Token Given", isLoggedIn: false, name:null})
    }
}

