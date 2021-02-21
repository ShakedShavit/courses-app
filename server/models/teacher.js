const mongoose = require('mongoose');
require('../db/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const teacherSchema = new mongoose.Schema({
    fullName: {
        type: 'String',
        required: true,
        trim: true
    },
    email: {
        type: 'String',
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: 'String',
        unique: true,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(value)) {
                throw new Error('Passwords must contain at least six characters, at least one letter, one number and on capital letter');
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

// Hiding info
teacherSchema.methods.toJSON = function() {
    const teacher = this;
    const teacherObj = teacher.toObject();

    delete teacherObj.password;
    delete teacherObj.tokens;

    return teacherObj;
}

teacherSchema.methods.generateAuthToken = async function() {
    const teacher = this;
    const token = jwt.sign(
        {
            _id: teacher._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );

    teacher.tokens = teacher.tokens.concat({ token });
    await teacher.save();
    return token;
}

teacherSchema.statics.findByCredentials = async function(email, password) {
    let teacher = await TeacherModel.findOne({ email });
    if (!teacher) throw new Error('Unable to login');

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) throw new Error('Unable to login');

    return teacher;
}

teacherSchema.methods.verifyTeacherWithPassword = async function(password) {
    const teacher = this;
    const isMatch = await bcrypt.compare(password, teacher.password);
    return isMatch;
}

// Hash the plain text password before saving
teacherSchema.pre('save', async function(next) {
    const teacher = this; 

    if (teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8);
    }

    next();
});

const TeacherModel = mongoose.model('teacherSchema', teacherSchema);

module.exports = TeacherModel;