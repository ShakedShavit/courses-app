// const mongoose = require('mongoose');
// require('../db/mongoose');

// const classAttendanceSchema = new mongoose.Schema({
//     course: {
//         type: mongoose.Types.ObjectId,
//         ref: 'Course',
//         required: true
//     },
//     classNumber: {
//         type: Number,
//         required: true
//     },
//     didStudentAttend: {
//         type: Boolean,
//         required: true
//     },
//     reasonForNotAttending: {
//         type: String,
//         trim: true,
//         validate: [
//             function(value) {
//                 return !(this.didStudentAttend);
//             }
//         ]
//     }
// }, {
//     timestamps: true
// });


// const ClassAttendanceModel = mongoose.model('ClassModel', classAttendanceSchema);

// module.exports = ClassAttendanceModel;