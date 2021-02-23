import React, { useContext, useEffect, useState } from 'react';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import { loginStudentInDB } from '../../server/db/student';
import { loginAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { loginTeacherInDB } from '../../server/db/teacher';

const LoginForm = () => {
    const { dispatchUserData } = useContext(LoginContext);

    const [isEmailOrIdInputEmpty, setIsEmailOrIdInputEmpty] = useState(false);
    const [passwordInputErrorMessage, setPasswordInputErrorMessage] = useState('');
    const [hasLoginFailed, setHasLoginFailed] = useState(false);

    let isComponentMounted = true;
    useEffect(() => {
        return () => { isComponentMounted = false };
    }, []);

    const emailAndIdInputOnBlur = (e) => {
        if (!isComponentMounted) return;

        if (e.target.value.trim() === '') return setIsEmailOrIdInputEmpty(true);
        setIsEmailOrIdInputEmpty(false);
    }

    const passwordInputOnBlur = (e) => {
        if (!isComponentMounted) return;

        if (e.target.value.trim() === '') return setPasswordInputErrorMessage('Password cannot be empty!');
        if (e.target.value.length < 6) return setPasswordInputErrorMessage('Password cannot contain less than 6 characters!');
        if (!(/w*[a-zA-Z]\w*/).test(e.target.value)) return setPasswordInputErrorMessage('Password must contain at least one letter!');
        if (!(/[\d]{1}/).test(e.target.value)) return setPasswordInputErrorMessage('Password must contain at least one number!');
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(e.target.value)) return setPasswordInputErrorMessage('Password must contain at least one capital letter!');

        setPasswordInputErrorMessage('');
    }

    const onSubmitLoginIn = (e) => {
        e.preventDefault();

        if (isEmailOrIdInputEmpty || passwordInputErrorMessage !== '') return;

        loginStudentInDB(e.target[0].value, e.target[1].value)
        .then((res) => {
            dispatchUserData(loginAction({ user: res.user, token: res.token }));
            saveUserOnCookie(res);
            if (isComponentMounted) setHasLoginFailed(false);
        })
        .catch((err) => {
            loginTeacherInDB(e.target[0].value, e.target[1].value)
            .then((res) => {
                dispatchUserData(loginAction({ user: res.user, token: res.token }));
                saveUserOnCookie(res);
                if (isComponentMounted) setHasLoginFailed(false);
            })
            .catch((err) => {
                console.log(err);
                if (isComponentMounted) setHasLoginFailed(true);
            });
        });
    }

    return (
        <div>
            <form onSubmit={onSubmitLoginIn} className="login-form">
                <input type="text" className="form-input" placeholder="Email / studentID" onBlur={emailAndIdInputOnBlur}></input>
                { isEmailOrIdInputEmpty && <span className="input-error-message">*Email or ID cannot be empty!</span> }

                <input type="password" className="form-input" placeholder="Password" onBlur={passwordInputOnBlur}></input>
                { passwordInputErrorMessage !== '' && <span className="input-error-message">*{passwordInputErrorMessage}</span> }
                
                <button type="submit" className="login-button" disabled={isEmailOrIdInputEmpty || passwordInputErrorMessage !== ''}>Login</button>

                { hasLoginFailed && <span className="input-error-message"><br></br>Login failed! Please try again</span> }
            </form>
        </div>
    )
};

export default LoginForm;