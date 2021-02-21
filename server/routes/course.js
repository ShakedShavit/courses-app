const express = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/course', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.query.courseRef);
        if (!course) {
            return res.status(404).send({
                status: 404,
                message: 'Course not found',
            });
        }
        res.status(200).send(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/course/get-all', auth, async (req, res) => {
    try {
        const courses = await Course.find();
        if (courses.length === 0) {
            return res.status(404).send({
                status: 404,
                message: 'No courses found',
            });
        }
        res.status(200).send(courses);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;