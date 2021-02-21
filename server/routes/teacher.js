const express = require('express');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Student = require('../models/student');
const auth = require('../middleware/auth');
const generator = require('generate-password');

const router = express.Router();

// router.get('/', async (req, res) => {
//     // const teachers = await Teacher.find({});
//     // await Teacher.deleteMany({});
//     res.send('API is working properly')
// });

// router.get('/teacher/me', auth, async (req, res) => {
//     res.send(req.teacher);
// });

router.post('/teacher/signup', async (req, res) => {
    const teacher = new Teacher({ ...req.body });
    try {
        await teacher.save();
        const token = await teacher.generateAuthToken();
        res.status(201).send({ teacher, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/teacher/login', async (req, res) => {
    try {
        const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
        const token = await teacher.generateAuthToken();
        res.send({ teacher, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/teacher/update/password', auth, async (req, res) => {
    try {
        const teacher = req.teacher;

        const isCurrentPasswordCorrect = await teacher.verifyTeacherWithPassword(req.body.currentPassword);
        if (!isCurrentPasswordCorrect) {
            return res.status(401).send({
                status: 401,
                message: 'Password is incorrect',
            });
        }

        teacher.password = req.body.newPassword;

        await req.teacher.save(); // Calls the decrypting of the password
        res.send(req.teacher);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/teacher/course/register', auth, async (req, res) => {
    try {
        const courseId = generator.generate({
            length: 8,
            numbers: true
        });

        const course = new Course({ ...req.body, courseId });
        await course.save();

        res.status(201).send(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/teacher/course/add-student', auth, async (req, res) => {
    try {
        let course = await Course.findOne({ courseId: req.body.courseId });
        if (!course) {
            return res.status(404).send({
                status: 404,
                message: 'Course not found',
            });
        }
        course = await course.addStudentToCourse(req.body.studentEmailOrId);
        if (typeof(course) === 'string') {
            return res.status(400).send({
                status: 400,
                message: course
            });
        }

        await course.save();

        res.status(200).send(course);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/teacher/get/student/course-attendance', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.query.studentId });
        if (!student) {
            return res.status(404).send({
                status: 404,
                message: 'Student not found'
            });
        }

        const reqCourseObjId = req.query.courseObjId;

        let courseIndex;
        if (!student.courses.some((course, index) => {
            if (reqCourseObjId === course.course.courseRef.toString()) {
                courseIndex = index;
                return true;
            }
        })) {
            return res.status(404).send({
                status: 404,
                message: 'Course not found'
            });
        }

        res.send(student.courses[courseIndex].course.courseAttendance);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;