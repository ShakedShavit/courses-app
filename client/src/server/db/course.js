import Axios from 'axios';

export const getCourseFromDB = async (courseRef, token) => {
    try {
        const res = await Axios.get('/course', {
            headers: {
                'Authorization': `Bearer ${token}` 
            },
            params: { courseRef }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Unable to find course');
        }
    }
}

export const getAllCoursesFromDB = async (token) => {
    try {
        const res = await Axios.get('/course/get-all', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Unable to find courses');
        }
    }
}