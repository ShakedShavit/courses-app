const express = require('express');
// const cors = require('cors');
// require('./db/mongoose');
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');
const courseRouter = require('./routes/course');

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
// app.use(cors());

// app.use(teacherRouter);
// app.use(studentRouter);
// app.use(courseRouter);



const path = require("path")


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '../client/build/index.html'));
    });
}



app.listen(port, "0.0.0.0", () => {
    console.log('Server listening on port: ', port);
});