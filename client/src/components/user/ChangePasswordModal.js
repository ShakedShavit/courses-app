import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';

const ChangePasswordModal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsChangePasswordModalOpen(false)
    }
    
    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <ChangePasswordForm
                    setIsChangePasswordModalOpen={props.setIsChangePasswordModalOpen}
                    setIsChangePasswordNoticeOpen={props.setIsChangePasswordNoticeOpen}
                    setNotificationText={props.setNotificationText}
                />

                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button grey-button" onClick={closeModalButton}>Cancel</span>
                </div>
            </div>
        </div>
    )
};

export default ChangePasswordModal;