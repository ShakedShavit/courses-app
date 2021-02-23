import React, { useContext, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { addStudentToCourseInDB } from '../../server/db/teacher';

const AddStudentToCourseForm = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [formErrorMessage, setFormErrorMessage] = useState('');

    const addStudentToCourseOnSubmit = (e) => {
        e.preventDefault();

        setFormErrorMessage('');

        addStudentToCourseInDB(props.courseId, e.target[0].value.trim(), userDataState.token)
        .then((res) => {
            props.setIsStudentAddedToCourseNoticeOpen(true);
            props.setNotificationText('Student added to course');
            props.setIsAddStudentToCourseModalOpen(false);
        })
        .catch((err) => {
            console.log(err);
            setFormErrorMessage(err.message);
        })
    }

    return (
        <form onSubmit={addStudentToCourseOnSubmit}>
            <input type="text" className="form-input" placeholder="Student ID / email" required></input>

            { formErrorMessage !== '' && <span className="input-error-message">*{formErrorMessage}</span> }
            
            <button type="submit" className="modal-button green-button">Add student to course</button>
        </form>
    )
};

export default AddStudentToCourseForm;