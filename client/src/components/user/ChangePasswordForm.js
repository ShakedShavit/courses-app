import React, { useContext, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { teacherChangePasswordInDB } from '../../server/db/teacher';
import { studentChangePasswordInDB } from '../../server/db/student';

const ChangePasswordForm = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [formErrorMessage, setFormErrorMessage] = useState('');

    let isStudent = false;
    if (!!userDataState.user.studentId) isStudent = true;

    const changePasswordOnSubmit = (e) => {
        e.preventDefault();

        const currentPassword = e.target[0].value.trim();
        const newPassword = e.target[1].value.trim();
        const repeatedNewPassword = e.target[2].value.trim();

        if (newPassword !== repeatedNewPassword) return setFormErrorMessage('New passwords do not match');
        if (newPassword === currentPassword) return setFormErrorMessage('Current password is the same as the new password');

        if (newPassword.length < 6) return setFormErrorMessage('Password cannot contain less than 6 characters!');
        if (!(/w*[a-zA-Z]\w*/).test(newPassword)) return setFormErrorMessage('Password must contain at least one letter!');
        if (!(/[\d]{1}/).test(newPassword)) return setFormErrorMessage('Password must contain at least one number!');
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(newPassword)) return setFormErrorMessage('Password must contain at least one capital letter!');

        setFormErrorMessage('');

        if (isStudent) {
            studentChangePasswordInDB(currentPassword, newPassword, userDataState.token)
            .then((res) => {
                props.setIsChangePasswordNoticeOpen(true);
                props.setNotificationText('Password changed successfully');
                props.setIsChangePasswordModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
                setFormErrorMessage('Current password is incorrect');
            });
        } else {
            teacherChangePasswordInDB(currentPassword, newPassword, userDataState.token)
            .then((res) => {
                props.setIsChangePasswordNoticeOpen(true);
                props.setNotificationText('Password changed successfully');
                props.setIsChangePasswordModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
                setFormErrorMessage('Current password is incorrect');
            });
        }
    }

    return (
        <form onSubmit={changePasswordOnSubmit}>
            <label>Current password:</label>
            <input type="password" className="form-input" placeholder="Current password" required></input>

            <label>New password:</label>
            <input type="password" className="form-input" placeholder="New password" required></input>

            <label>Repeat new password:</label>
            <input type="password" className="form-input" placeholder="Repeat new password" required></input>

            { formErrorMessage !== '' && <span className="input-error-message">{formErrorMessage}</span> }
            
            <button type="submit" className="change-password-button modal-button green-button">Change password</button>
        </form>
    )
};

export default ChangePasswordForm;