import React from 'react';
import RegisterCourseForm from './RegisterCourseForm';

const AddCourseModal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsAddCourseModalOpen(false)
    }
    
    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <RegisterCourseForm setIsAddCourseModalOpen={props.setIsAddCourseModalOpen} setIsRegisterCourseVerificationNoticeOpen={props.setIsRegisterCourseVerificationNoticeOpen} />

                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button grey-button" onClick={closeModalButton}>Cancel</span>
                </div>
            </div>
        </div>
    )
};

export default AddCourseModal;