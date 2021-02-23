import React from 'react';
import ClassAttendance from './ClassAttendance';

const AttendanceModal = (props) => {
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setShowAttendanceModal(false);
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="attendance-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModal}>x</button>

                <div className="attendance-form-header">
                    <div className="class-number">Class number</div>
                    <div className="attendance-checkbox">Attended class?</div>
                    <div className="reason">Reason</div>
                </div>

                { props.classesArr.map((classAttendance) => {
                    return (
                        <ClassAttendance isForm={props.isForm} classAttendanceDetails={classAttendance} key={classAttendance.classNumber} />
                    );
                }) }

                {
                    props.isForm ?
                    <>
                        <button className="attendance-submit-button modal-button green-button" type="submit">submit</button>

                        <div className="modal-buttons">
                            <span className="modal-button grey-button close-attendance-modal" onClick={closeModal}>Cancel</span>
                        </div>
                    </> :
                    <div className="modal-buttons">
                        <span className="modal-button grey-button close-attendance-modal" onClick={closeModal}>Close</span>
                    </div>
                }
            </div>
        </div>
    )
};

export default AttendanceModal;