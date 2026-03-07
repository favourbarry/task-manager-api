const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.createUser = async (userData) => {
    const existingUser = await User.query().findOne({ email: userData.email});
    if(existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.query().insert({...userData, password: hashedPassword});
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token, user: newUser };
};

exports.findByEmail = async (email) => {
    return await User.query().findOne({email}); 
};
exports.validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (userData) => {
    return jwt.sign({ id: userData.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};