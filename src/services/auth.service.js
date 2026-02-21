const bcrypt = require("bcrypt");
const jwt = requre("jsonwebtoken");
const User = require("../models/user.model");

exports.createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await User.query().insert({...userData, password: hashedPassword});
};

exports.findByEmail = async (email) => {
    return await User.query().findOne({email}); 
};
