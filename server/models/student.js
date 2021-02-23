const mongoose = require('mongoose');
require('../db/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const studentSchema = new mongoose.Schema({
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
    studentId: {
        type: 'String',
        unique: true,
        required: true,
        trim: true,
    },
    courses: [{
        course: {
            courseRef: {
                type: mongoose.Types.ObjectId,
                ref: 'Course',
                required: true
            },
            courseAttendance: [{
                classNumber: {
                    type: Number,
                    required: true,
                },
                didStudentAttend: {
                    type: Boolean,
                    required: true
                },
                reasonForNotAttending: {
                    type: String,
                    trim: true,
                    validate: [
                        function(value) {
                            return !(this.didStudentAttend && value !== '');
                        }
                    ]
                }
            }]
        }
    }],
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

studentSchema.plugin(beautifyUnique);

// Hiding info
studentSchema.methods.toJSON = function() {
    const student = this;
    const studentObj = student.toObject();

    delete studentObj.password;
    delete studentObj.tokens;

    return studentObj;
}

studentSchema.methods.generateAuthToken = async function() {
    const student = this;

    console.log('student: ', student)

    const token = jwt.sign(
        {
            _id: student._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );

    console.log('token2: ', token)

    student.tokens = student.tokens.concat({ token });
    await student.save();

    return token;
}

studentSchema.statics.findByCredentials = async function(emailOrStudentId, password) {
    let student = await StudentModel.findOne({ email: emailOrStudentId });
    if (!student) {
        student = await StudentModel.findOne({ studentId: emailOrStudentId });
        if (!student) throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) throw new Error('Unable to login');

    return student;
}

studentSchema.methods.verifyTeacherWithPassword = async function(password) {
    const student = this;
    const isMatch = await bcrypt.compare(password, student.password);
    return isMatch;
}

// Hash the plain text password before saving
studentSchema.pre('save', async function(next) {
    const student = this;

    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8);
    }

    next();
});

studentSchema.methods.addCourseToStudent = async function(course) {
    const student = this;

    courseObj = { course: { courseRef: course } };
    student.courses.push(courseObj);

    await student.save();

    return student;
};

// studentSchema.methods.addCourseAttendance = async function() {
//     const student = this;

//     if (!course) {
//         throw new Error('Unable to find course')
//     }

//     courseObj = { course: { courseRef: course } }
//     student.courses = [ ...student.courses ].concat(courseObj);

//     return this.save();
// };

const StudentModel = mongoose.model('studentSchema', studentSchema);

module.exports = StudentModel;