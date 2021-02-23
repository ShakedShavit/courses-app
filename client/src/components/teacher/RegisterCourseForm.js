import React, { useContext, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { registerCourseInDB } from '../../server/db/teacher';

const RegisterCourseForm = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [dateInputErrorMessage, setDateInputErrorMessage] = useState('');
    // const [numberOfClassesAWeekErrorMessage, setNumberOfClassesAWeekErrorMessage] = useState('');
    // const [totalNumberOfClassesErrorMessage, setTotalNumberOfClassesErrorMessage] = useState('');
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const dateInputOnBlur = (e) => {
        if (!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
            .test(e.target.value)) {
                setDateInputErrorMessage('Date is invalid. The format should be as follows dd.mm.yy');
        } else {
            setDateInputErrorMessage('');
        }
    }

    // const numberOfClassesAWeekInputOnBlur = (e) => {
    //     const numberOfClassesAWeek = e.target.value;
    //     const totalNumberOfClasses = e.target.parentNode.childNodes[5].value;
    //     if (numberOfClassesAWeek > totalNumberOfClasses && numberOfClassesAWeek !== '' && totalNumberOfClasses !== '') setNumberOfClassesAWeekErrorMessage('Number of classes a week cannot be larger than total number of classes');
    //     else if (numberOfClassesAWeek < 0) setNumberOfClassesAWeekErrorMessage('Number of classes a week cannot be smaller than 0');
    //     else setNumberOfClassesAWeekErrorMessage('');
    // }

    // const totalNumberOfClassesInputOnBlur = (e) => {
    //     const totalNumberOfClasses = e.target.value;
    //     const numberOfClassesAWeek = e.target.parentNode.childNodes[4].value;
    //     if (numberOfClassesAWeek > totalNumberOfClasses && totalNumberOfClasses !== '' && numberOfClassesAWeek !== '') setTotalNumberOfClassesErrorMessage('Total number of classes cannot be smaller than number of classes a week');
    //     else if (totalNumberOfClasses < 0) setTotalNumberOfClassesErrorMessage('Total number of classes cannot be smaller than 0');
    //     else setTotalNumberOfClassesErrorMessage('');
    // }

    const registerCourseOnSubmit = (e) => {
        e.preventDefault();

        const numberOfClassesAWeek = parseInt(e.target[4].value);
        const totalNumberOfClasses = parseInt(e.target[5].value);

        if (!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
            .test(e.target[3].value)) {
                setFormErrorMessage('Cannot register course yet. Date input is invalid')
                return;
        }
        if (numberOfClassesAWeek < 0) {
            setFormErrorMessage('Cannot register course yet. Number of classes a week cannot be smaller than 0');
            return;
        }
        if (totalNumberOfClasses < 0) {
            setFormErrorMessage('Cannot register course yet. Total number of classes cannot be smaller than 0');
            return;
        }
        if (numberOfClassesAWeek > totalNumberOfClasses) {
            setFormErrorMessage('Total number of classes cannot be smaller than number of classes a week');
            return;
        }

        const courseDetails = {
            subject: e.target[0].value,
            name: e.target[1].value,
            professor: e.target[2].value,
            startingDate: e.target[3].value,
            numberOfClassesAWeek,
            totalNumberOfClasses
        }

        setFormErrorMessage('');
        
        registerCourseInDB(courseDetails, userDataState.token)
        .then((res) => {
            props.setIsAddCourseModalOpen(false);
            props.setIsRegisterCourseVerificationNoticeOpen(true);
        })
        .catch((err) => {
            console.log(err);
            setFormErrorMessage('Register action failed. Please try again');
        });
    }

    return (
        <form onSubmit={registerCourseOnSubmit}>
            <input type="text" className="form-input" placeholder="Subject" required></input>

            <input type="text" className="form-input" placeholder="Name" required></input>

            <input type="text" className="form-input" placeholder="Professor" required></input>

            <input type="text" className="form-input" placeholder="Starting date" onBlur={dateInputOnBlur} required></input>
            { dateInputErrorMessage !== '' && <span className="input-error-message">*{dateInputErrorMessage}</span> }

            <label>Number of classes a week:</label>
            <input type="Number" className="form-input" placeholder="Classes a week" min="0" required></input>

            <label>Total number of classes:</label>
            <input type="Number" className="form-input" placeholder="Total classes" min="0" required></input>

            { formErrorMessage !== '' && <span className="input-error-message">{formErrorMessage}</span> }
            
            <button type="submit" className="modal-button green-button">Register</button>
        </form>
    )
};

export default RegisterCourseForm;