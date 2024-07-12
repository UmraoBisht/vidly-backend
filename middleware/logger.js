function login(req, res, next) {
    console.log("Loging...");
    next();
}

function authenticate(req,res,next){
    console.log("Authenticating...");
    next();
}

module.exports = {login,authenticate};