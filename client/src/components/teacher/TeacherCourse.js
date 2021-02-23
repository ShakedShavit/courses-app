import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getStudentFromDB } from '../../server/db/student';
import AddStudentToCourseModal from './AddStudentToCourseModal';
import EnrolledStudent from './EnrolledStudent';
import Notification from '../main/Notification';
import CourseWrapper from '../user/CourseWrapper';

const TeacherCourse = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [attendants, setAttendants] = useState([]);
    const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);
    const [isAddStudentToCourseModalOpen, setIsAddStudentToCourseModalOpen] = useState(false);
    const [isStudentAddedToCourseNoticeOpen, setIsStudentAddedToCourseNoticeOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');

    const students = [];
    
    useEffect(async () => {
        for (let student of props.course.attendants) {
            const res = await getStudentFromDB(student, userDataState.token);
            students.push(res);
        }
        setAttendants(students);
    }, []);

    const switchShowEnrolledStudentsOnClick = () => {
        setShowEnrolledStudents(!showEnrolledStudents);
    }

    const openAddStudentToCourseModalOnClick = () => {
        setIsAddStudentToCourseModalOpen(true);
    }

    return (
        <div className="user-course">
            <CourseWrapper course={props.course} />
            
            <br></br>
            { !showEnrolledStudents && <button className="show-students-button" onClick={switchShowEnrolledStudentsOnClick}>Show enrolled students</button> }
            { showEnrolledStudents && <button className="show-students-button" onClick={switchShowEnrolledStudentsOnClick}>Hide</button> }
            
            {
                showEnrolledStudents &&
                <div className="enrolled-students-wrapper">
                    { showEnrolledStudents &&
                        attendants.map((student) => {
                            if (!student) return;

                            return <EnrolledStudent
                                key={student._id}
                                courseObjId={props.course._id}
                                studentDetails={student}
                                totalNumberOfClasses={props.course.totalNumberOfClasses}
                                />;
                    }) }
                </div>
            }

            <button className="add-student-button" onClick={openAddStudentToCourseModalOnClick}>Add student</button>
            {
                isAddStudentToCourseModalOpen &&
                <AddStudentToCourseModal
                    setIsAddStudentToCourseModalOpen={setIsAddStudentToCourseModalOpen}
                    setIsStudentAddedToCourseNoticeOpen={setIsStudentAddedToCourseNoticeOpen}
                    setNotificationText={setNotificationText}
                    courseId={props.course.courseId}
                />
            }

            <br></br><br></br>

            { isStudentAddedToCourseNoticeOpen && <Notification setIsNotificationOpen={setIsStudentAddedToCourseNoticeOpen} text={notificationText} /> }
        </div>
    )
};

export default TeacherCourse;