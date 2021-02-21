const mongoose = require('mongoose');
require('../db/mongoose');
const Student = require('./student')

const courseSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    professor: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    startingDate: {
        type: String,
        validate(value) {
            if (!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
            .test(value)) {
                throw new Error('Date is invalid');
            }
        }
    },
    numberOfClassesAWeek: {
        type: 'Number',
        required: true,
        validate(value) {
            if (value < 1) throw new Error('Number of courses a week must be larger than zero');
        }
    },
    totalNumberOfClasses: {
        type: 'Number',
        required: true,
        validate(value) {
            if (value < 1) throw new Error('Total number of courses must be larger than zero');
        }
    },
    attendants: [{
        type: mongoose.Types.ObjectId,
        ref: 'Student',
        required: true
    }]
}, {
    timestamps: true
});

courseSchema.methods.addStudentToCourse = async function(studentEmailOrId) {
    const course = this;

    let student = await Student.findOne({ email: studentEmailOrId });
    if (!student) {
        student = await Student.findOne({ studentId: studentEmailOrId });
        if (!student) return ('Unable to find student');
    }

    const isStudentAlreadyEnrolled = course.attendants.some((attendee) => {
        return attendee.toString() === student._id.toString();
    });

    if (isStudentAlreadyEnrolled) {
        return ('Student already enrolled');
    }

    student = await student.addCourseToStudent(course);
    course.attendants.push(student);
    await course.save();

    return course;
};

const CourseModel = mongoose.model('CourseModel', courseSchema);

module.exports = CourseModel;