const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try{
        const user = await authService.createUser(req.body);
        res.status(201).json(user);
    } catch(error){
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try{
        const user = await authService.findByEmail(req.body.email);
        if(!user){
            return res.status(401).json({message: 'Invalid credentials.'});
        }
    } catch(error){
        next(error);
    }
};
