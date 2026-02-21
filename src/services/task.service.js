const taskModel = require('../models/task.model');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createTask = async (data, userId) => {

    const user = await userModel.query().findById(userId);
    if(!user.is_verified){
        throw new Error('User must be verified to create tasks');
    }
    if(!data.title) {
        throw new Error('Title is required');
    }
    return await taskModel.create(data, userId);
};

exports.getAllTasks = async () => {
    return await taskModel.findAll();
};

exports.register = async (data) => {
    if(!data || !data.password) {
        throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await userModel.createUser({...data, password: hashedPassword});
};

exports.login = async (data) => {
    const user = await userModel.findByEmail(data.email);
    if(!user || !(await bcrypt.compare(data.password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || 'secret', {expiresIn: '24h'});
    return {token, user: {id: user.id, email: user.email, username: user.username}};
};
