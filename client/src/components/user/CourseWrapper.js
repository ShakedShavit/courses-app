import React from 'react';

const CourseWrapper = (props) => {
    return (
        <div className="course-wrapper">
            <span><u className="course-property">Name:</u> <span className="course-property-value">{props.course.name}</span></span>
            <span><u className="course-property">Subject:</u> <span className="course-property-value">{props.course.subject}</span></span>
            <span><u className="course-property">Professor:</u> <span className="course-property-value">{props.course.professor}</span></span>
            <span><u className="course-property">Course ID:</u> <span className="course-property-value">{props.course.courseId}</span></span>
            <span><u className="course-property">Starting date:</u> <span className="course-property-value">{props.course.startingDate}</span></span>
            <span><u className="course-property">Number of classes a week:</u> <span className="course-property-value">{props.course.numberOfClassesAWeek}</span></span>
            <span><u className="course-property">Total number of classes:</u> <span className="course-property-value">{props.course.totalNumberOfClasses}</span></span>
        </div>
    )
};

export default CourseWrapper;