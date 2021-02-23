import React from 'react';

const ClassAttendance = (props) => {
    return (
        <div className="attendance-inputs">
            <div className="class-number">{props.classAttendanceDetails.classNumber}</div>
            {
                props.isForm ?
                <>
                    <div className="attendance-checkbox"><input type="checkbox" defaultChecked={props.classAttendanceDetails.didStudentAttend}></input></div>
                    <textarea className="reason" defaultValue={props.classAttendanceDetails.reasonForNotAttending}></textarea>
                </> :
                <>
                    <div className="attendance-checkbox"><input type="checkbox" onChange={() => {}} checked={props.classAttendanceDetails.didStudentAttend}></input></div>
                    <div className="reason">{props.classAttendanceDetails.reasonForNotAttending}</div>
                </>
            }
        </div>
    )
};

export default ClassAttendance;