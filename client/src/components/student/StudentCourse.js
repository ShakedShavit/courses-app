import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getCourseFromDB } from '../../server/db/course';
import { getStudentAttendanceFromDB, insertStudentAttendanceInDB } from '../../server/db/student';
import Notification from '../main/Notification';
import AttendanceModal from './AttendanceModal';
import { getIndexOfClassInAttendanceArray } from '../../utils/utils';
import CourseWrapper from '../user/CourseWrapper';

const StudentCourse = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [course, setCourse] = useState();
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [isUpdateStudentAttendanceNoticeOpen, setIsUpdateStudentAttendanceNoticeOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const [courseAttendance, setCourseAttendance] = useState([]); // course attendance from db
    const [classesArr, setClassesArr] = useState([]);

    useEffect(() => {
        getCourseFromDB(props.courseDetailsAndStudentAttendance.courseRef, userDataState.token)
        .then((res) => {
            setCourse(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    // When opening modal update the course attendance array from db (so previous changes will be visible without refreshing page)
    useEffect(() => {
        if (showAttendanceModal) {
            getStudentAttendanceFromDB(props.courseObjId, userDataState.token)
            .then((res) => {
                setCourseAttendance(res);
            })
            .catch((err) => {
                console.log(err);
                setCourseAttendance(props.courseDetailsAndStudentAttendance.courseAttendance);
            });
        }
    }, [showAttendanceModal]);

    useEffect(() => {
        if (courseAttendance.length === 0 && classesArr.length !== 0) return;

        // Fill classes array with the classes attendance from the context and default values
        const arr = [];
        for (let i = 0; i < course?.totalNumberOfClasses; i++) {
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

    const showAttendanceModalOnClick = () => {
        setShowAttendanceModal(!showAttendanceModal);
    }

    const changeAttendanceOnSubmit = (e) => {
        e.preventDefault();

        let attendanceInputs = Array.from(e.target.children[0].children[0].children).slice(2);
        attendanceInputs = attendanceInputs.slice(0, attendanceInputs.length - 2);

        // Array that holds all the changes in the classes attendance
        const classesUpdateArr = [];
        for (let [i, classInputs] of attendanceInputs.entries()) {
            const classDetailsArr = Array.from(classInputs.children);
            if (classesArr[i].didStudentAttend !== classDetailsArr[1].children[0].checked
                || classesArr[i].reasonForNotAttending !== classDetailsArr[2].value) {
                    classesUpdateArr.push({
                        classNumber: i + 1,
                        didStudentAttend: classDetailsArr[1].children[0].checked,
                        reasonForNotAttending: classDetailsArr[2].value,
                    });
                }
        }

        if (classesUpdateArr.length !== 0) {
            insertStudentAttendanceInDB(props.courseObjId, classesUpdateArr, userDataState.token)
            .then((res) => {
                // Update the original attendance array to reflect the last changes (so changing back is possible without refreshing the page)
                for (let i = 0; i < classesArr.length; i++) {
                    let updatedClassIndex = getIndexOfClassInAttendanceArray(classesUpdateArr, i);
                    if (updatedClassIndex !== -1) {
                        classesArr[i] = {
                            classNumber: i + 1,
                            didStudentAttend: classesUpdateArr[updatedClassIndex].didStudentAttend,
                            reasonForNotAttending: classesUpdateArr[updatedClassIndex].reasonForNotAttending,
                            key: i
                        };
                    }
                }

                setShowAttendanceModal(false);
                setIsUpdateStudentAttendanceNoticeOpen(true);
                setNotificationText('Attendance updated successfully');
            })
            .catch((err) => {
                console.log(err);
                setIsUpdateStudentAttendanceNoticeOpen(true);
                setNotificationText('An error has occurred. No changes have been made');
                return;
            });
        }
        else {
            setIsUpdateStudentAttendanceNoticeOpen(true);
            setNotificationText('No changes have been made');
        }

        setShowAttendanceModal(false);
    }

    return (
        <>
            {
                !!course &&
                <div className="user-course">
                    <CourseWrapper course={course} />

                    { !showAttendanceModal && <button className="show-attendance-button" onClick={showAttendanceModalOnClick}>Show / change attendance</button> }

                    <form onSubmit={changeAttendanceOnSubmit}>
                        {
                            showAttendanceModal &&
                            <AttendanceModal
                                setShowAttendanceModal={setShowAttendanceModal}
                                classesArr={classesArr}
                                isForm={true}
                            />
                        }
                    </form>
                </div>
            }

            { isUpdateStudentAttendanceNoticeOpen && <Notification setIsNotificationOpen={setIsUpdateStudentAttendanceNoticeOpen} text={notificationText} /> }
        </>
    )
};

export default StudentCourse;