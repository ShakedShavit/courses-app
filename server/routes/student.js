const express = require('express');
const Student = require('../models/student');
const auth = require('../middleware/auth');
const generator = require('generate-password');

const router = express.Router();

router.delete('/student/delete-all', async (req, res) => {
    try {
        await Student.deleteMany();
        const students = await Student.find();
        console.log(students);
        res.status(200).send(students);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/student/signup', async (req, res) => {
    const studentId = generator.generate({
        length: 8,
        numbers: true
    });
    const student = new Student({ ...req.body, studentId });

    try {
        await student.save();
        const token = await student.generateAuthToken();
        res.status(201).send({ student, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/student/login', async (req, res) => {
    try {
        const a = await Student.find();
        console.log(a);

        const student = await Student.findByCredentials(req.body.emailOrId, req.body.password);

        console.log('student: ', student)

        const token = await student.generateAuthToken();
        res.send({ student, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/student/get', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.query._id });

        if (!student) {
            return res.status(404).send({
                status: 404,
                message: 'Student not found'
            });
        }

        res.send(student);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/student/get/course-attendance', auth, async (req, res) => {
    try {
        const student = req.student;
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

// router.get('/student/get/all-courses-attendance', auth, async (req, res) => {
//     try {
//         const coursesAttendances
//         res.send(req.student.courses);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.patch('/student/update/password', auth, async (req, res) => {
    try {
        const student = req.student;
        const isCurrentPasswordCorrect = await student.verifyTeacherWithPassword(req.body.currentPassword);

        if (!isCurrentPasswordCorrect) {
            return res.status(401).send({
                status: 401,
                message: 'Password is incorrect',
            });
        }

        student.password = req.body.newPassword;

        await req.student.save(); // Calls the decrypting of the password
        res.send(req.student);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Insert or change attendance of student in classes of specific course
router.post('/student/course-attendance/insert', auth, async (req, res) => {
    try {
        const student = req.student;

        let isStudentEnrolledInCourse = false;
        const courseObjId = req.body.courseObjId.toString();
        let courseIndex;

        student.courses.forEach((courseObj, index) => {
            if (courseObj.course.courseRef.toString() === courseObjId) {
                isStudentEnrolledInCourse = true;
                courseIndex = index;
            }
        });
        if (!isStudentEnrolledInCourse) {
            return res.status(400).send({
                status: 400,
                message: 'Student is not enrolled in this course',
            });
        }

        const studentCourseAttendance = student.courses[courseIndex].course.courseAttendance;

        let spliceIndexesArr = [];

        // Finds index of classes if the are classNumbers that are already inserted
        studentCourseAttendance.forEach((lesson, i) => {
            req.body.classesAttendance.forEach(addedLesson => {
                if (lesson.classNumber === parseInt(addedLesson.classNumber)) {
                    spliceIndexesArr.push(i);
                }
            });
        });

        // Deletes existing classes if the are classNumbers that are to be inserted
        if (spliceIndexesArr.length !== 0) {
            spliceIndexesArr.forEach((spliceIndex, i) => {
                i === 0 ?
                student.courses[courseIndex].course.courseAttendance.splice(spliceIndex, 1)
                : student.courses[courseIndex].course.courseAttendance.splice(spliceIndex - 1, 1)
            });
        }

        student.courses[courseIndex].course.courseAttendance = studentCourseAttendance.concat(req.body.classesAttendance);

        await student.save();
        res.send(student);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
});


module.exports = router;