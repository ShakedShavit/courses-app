import React from 'react';
import AddStudentToCourseForm from './AddStudentToCourseForm';

const AddStudentToCourseModal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsAddStudentToCourseModalOpen(false)
    }
    
    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <AddStudentToCourseForm
                    setIsAddStudentToCourseModalOpen={props.setIsAddStudentToCourseModalOpen}
                    setIsStudentAddedToCourseNoticeOpen={props.setIsStudentAddedToCourseNoticeOpen}
                    setNotificationText={props.setNotificationText}
                    courseId={props.courseId}
                />

                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button grey-button" onClick={closeModalButton}>Cancel</span>
                </div>
            </div>
        </div>
    )
};

export default AddStudentToCourseModal;