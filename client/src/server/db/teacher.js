import Axios from 'axios';

export const loginTeacherInDB = async (email, password) => {
    try {
        const res = await Axios.post('/teacher/login', {
            email,
            password
        });

        return { user: res.data.teacher, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to login. Please try again');
        }
    }
};

export const registerCourseInDB = async (courseDetails, token) => {
    try {
        const res = await Axios.post('/teacher/course/register', courseDetails, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to register course. Please try again');
        }
    }
};

export const teacherChangePasswordInDB = async (currentPassword, newPassword, token) => {
    try {
        const res = await Axios.patch('/teacher/update/password', {currentPassword, newPassword}, {
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
};

export const addStudentToCourseInDB = async (courseId, studentEmailOrId, token) => {
    try {
        const res = await Axios.post('/teacher/course/add-student', { courseId, studentEmailOrId }, {
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
};

export const getStudentAttendanceWithStudentIdFromDB = async (studentId, courseObjId, token) => {
    try {
        const res = await Axios.get('/teacher/get/student/course-attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { studentId, courseObjId }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error(err.response.data.message);
        }
    }
}