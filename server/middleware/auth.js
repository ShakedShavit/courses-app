const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.TOKEN_SECRET);

        let isTeacher = true;
        let user = await Teacher.findOne({
            _id: data._id,
            "tokens.token": token
        });
        if (!user) {
            isTeacher = false;

            user = await Student.findOne({
                _id: data._id,
                "tokens.token": token
            });

            if (!user) throw new Error();
        }

        isTeacher ? req.teacher = user : req.student = user;
        req.token = token;
        next();
    } catch(err) {
        res.status(400).send({
            status: 400,
            message: "not authenticated"
        });
    }
};

module.exports = auth;