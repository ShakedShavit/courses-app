import Axios from 'axios';

export const loginStudentInDB = async (emailOrId, password) => {
    try {
        const res = await Axios.post('/student/login', {
            emailOrId,
            password
        });

        return { user: res.data.student, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to login. Please try again');
        }
    }
}

export const studentChangePasswordInDB = async (currentPassword, newPassword, token) => {
    try {
        const res = await Axios.patch('/student/update/password', {currentPassword, newPassword}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 401) {
            throw new Error('Current password is incorrect');
        }
    }
}

export const getStudentFromDB = async (_id, token) => {
    try {
        const res = await Axios.get('/student/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { _id }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            // throw new Error('Student not found');
            console.log('Student not found');
        }
    }
}

export const insertStudentAttendanceInDB = async (courseObjId, classesAttendance, token) => {
    try {
        const res = await Axios.post('/student/course-attendance/insert', { courseObjId, classesAttendance }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error(err.response.data.message);
        }
    }
}

export const getStudentAttendanceFromDB = async (courseObjId, token) => {
    try {
        const res = await Axios.get('/student/get/course-attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { courseObjId }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Course not found');
        }
    }
}

// export const getAllStudentAttendanceFromDB = async (token) => {
//     try {
//         const res = await Axios.get('/student/get/all-courses-attendance', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         return res.data;
//     } catch (err) {
//         if (err.response.status === 404) {
//             throw new Error('Course not found');
//         }
//     }
// }