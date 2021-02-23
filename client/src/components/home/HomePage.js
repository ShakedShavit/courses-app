import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getAllCoursesFromDB } from '../../server/db/course';
import Notification from '../main/Notification';
import StudentCourse from '../student/StudentCourse';
import AddCourseModal from '../teacher/AddCourseModal';
import TeacherCourse from '../teacher/TeacherCourse';

const HomePage = () => {
    const { userDataState } = useContext(LoginContext);
    
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [isRegisterCourseVerificationNoticeOpen, setIsRegisterCourseVerificationNoticeOpen] = useState(false);
    const [courses, setCourses] = useState([]);

    let notificationText = 'Course has been added successfully';

    let isComponentMounted = true;
    useEffect(() => {
        return () => {isComponentMounted = false;};
    }, []);

    const openAddCourseModal = () => {
        setIsAddCourseModalOpen(true);
    }

    useEffect(() => {
        if (!userDataState.user || !!userDataState.user.studentId) return;

        getAllCoursesFromDB(userDataState.token)
        .then((res) => {
            setCourses([ ...courses ].concat(res));
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div className="home-page">
            {
                !!userDataState.user && !!userDataState.user.studentId ?
                <div>
                    {
                        userDataState.user.courses.length === 0 ?
                        <span className="home-headline">I am currently not enrolled in any courses</span>:
                        <span className="home-headline">My Courses</span>
                    }

                    { userDataState.user.courses.map((course) => {
                        return (
                            <StudentCourse courseDetailsAndStudentAttendance={course.course} courseObjId={course.course.courseRef} key={course._id} />
                        )
                    }) }
                </div>:
                !!userDataState.user && !userDataState.user.studentId &&
                <div>
                    <span className="home-headline">Courses</span>

                    { courses.map((course) => {
                        return (
                            <TeacherCourse key={course._id} course={course} />
                        );
                    })}
                    
                    { !isAddCourseModalOpen && <button className="add-course-button"onClick={openAddCourseModal}>Add Course</button> }
                    { isAddCourseModalOpen && <AddCourseModal
                        setIsAddCourseModalOpen={setIsAddCourseModalOpen}
                        setIsRegisterCourseVerificationNoticeOpen={setIsRegisterCourseVerificationNoticeOpen}
                    /> }
                </div>
            }
            { isRegisterCourseVerificationNoticeOpen && <Notification text={notificationText} setIsNotificationOpen={setIsRegisterCourseVerificationNoticeOpen} /> }
        </div>
    )
};

export default HomePage;