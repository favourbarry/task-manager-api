const taskService = require('../services/task.service');

exports.createTask = async (req, res, next) => {
    try{
        const task = await taskService.createTask(req.body, req.user.userId);
        res.status(201).json(task);
    
    } catch(error){
        next(error);
    }
};
exports.getAllTasks = async (req, res, next) => {
    try{
        const task = await taskService.getAllTasks();
        res.json(task);
    } catch(error){
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try{
       // console.log('Request body:', req.body);
        const user = await taskService.register(req.body);
        res.status(201).json(user);
    } catch(error){
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try{
        const result = await taskService.login(req.body);
        res.json(result);
    } catch(error){
        next(error);
    }
};
