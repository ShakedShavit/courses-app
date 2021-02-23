import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getStudentAttendanceWithStudentIdFromDB } from '../../server/db/teacher';
import AttendanceModal from '../student/AttendanceModal';
import { getIndexOfClassInAttendanceArray } from '../../utils/utils';

const EnrolledStudent = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [isStudentAttendanceModalOpen, setIsStudentAttendanceModalOpen] = useState(false);
    const [courseAttendance, setCourseAttendance] = useState([]); // course attendance from db
    const [classesArr, setClassesArr] = useState([]);

    const openAttendanceModalOnClick = () => {
        setIsStudentAttendanceModalOpen(true);
    }

    useEffect(() => {
        getStudentAttendanceWithStudentIdFromDB(props.studentDetails.studentId, props.courseObjId, userDataState.token)
        .then((res) => {
            setCourseAttendance(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        const arr = [];
        for (let i = 0; i < props.totalNumberOfClasses; i++) {
            let courseAttendanceIndex = getIndexOfClassInAttendanceArray(courseAttendance, i);
            if (courseAttendanceIndex !== -1) {
                arr.push({
                    classNumber: i + 1,
                    didStudentAttend: courseAttendance[courseAttendanceIndex].didStudentAttend,
                    reasonForNotAttending: courseAttendance[courseAttendanceIndex].reasonForNotAttending,
                    key: courseAttendance[courseAttendanceIndex]._id
                });
            } else {
                arr.push({
                    classNumber: i + 1,
                    didStudentAttend: false,
                    reasonForNotAttending: '',
                    key: i
                });
            }
        }
        setClassesArr(arr);
    }, [courseAttendance]);

    return (
        <div>
            <div>
                <span className="student-detail">Name: {props.studentDetails.fullName}</span>
                <br></br><br></br>
                <span className="student-detail">email: {props.studentDetails.email}</span>
                <br></br><br></br>
                <span className="student-detail">Student ID: {props.studentDetails.studentId}</span>
                <br></br><br></br>
                <button onClick={openAttendanceModalOnClick} className="show-attendance-button">Show attendance</button>
            </div>

            {
                isStudentAttendanceModalOpen &&
                <AttendanceModal
                    setShowAttendanceModal={setIsStudentAttendanceModalOpen}
                    classesArr={classesArr}
                    isForm={false}
                />
            }
        </div>
    )
};

export default EnrolledStudent;