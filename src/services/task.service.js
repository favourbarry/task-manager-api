const taskModel = require('../models/task.model');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createTask = async (data, userId) => {
    const AppError = require('../utils/AppError');
    if(!data.title) {
        throw new AppError('Title is required', 400);
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
    if(!data || !data.email || !data.password) {
        throw new Error('Email and password are required');
    }
    const user = await userModel.findByEmail(data.email);
    if(!user || !(await bcrypt.compare(data.password, user.password))) {
        throw new Error('Invalid credentials', 400);
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || 'secret', {expiresIn: '24h'});
    return {token, user: {id: user.id, email: user.email, username: user.username}};
};
