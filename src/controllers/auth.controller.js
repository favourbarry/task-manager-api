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
        const isValid = await authService.validatePassword(req.body.password, user.password);
        if(!isValid){
            return res.status(401).json({message: 'Invalid credentials.'});
        }
        const token = authService.generateToken(user);
        res.json({ user: { id: user.id, email: user.email }, token });
    } catch(error){
        next(error);
    }
};
