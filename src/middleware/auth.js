const jwt = require('jsonwebtoken');
const User = require('../models/user')


//token will be passed in the header of the rquest
//the token from the header is used to verify and get the particular user that has that token
//then we get the user
//we set req.user = user so that, e don't wanna fetch the user again since we already fetched it from the DB
const auth = async (req, res, next) => {
    
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisthetaskmanagerapp');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if(!user) throw new Error();

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: "Please Authenticate"
        })
    }
}

module.exports = auth