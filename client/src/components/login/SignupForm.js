// import React, { useContext, useState } from 'react';
// import validator from 'validator';
// import { LoginContext } from '../../context/loginContext';

// const SignupForm = () => {
//     const { dispatchUserData } = useContext(LoginContext);

//     const [nameInputErrorMessage, setNameInputErrorMessage] = useState('');
//     const [isEmailInputInvalid, setIsEmailInputInvalid] = useState(false);
//     const [passwordInputErrorMessage, setPasswordInputErrorMessage] = useState('');
//     const [hasSignupFailed, setHasSignupFailed] = useState(false);

//     const nameInputOnBlur = (e) => {
//         if (!(e.target.value.trim().includes(' ')) || e.target.value.trim() === '') return setNameInputErrorMessage('Full name input must consist of at least a surname and a forename');
//         setNameInputErrorMessage('');
//     }

//     const emailInputOnBlur = (e) => {
//         if (!validator.isEmail(e.target.value.trim())) return setIsEmailInputInvalid(true);
//         setIsEmailInputInvalid(false);
//     }

//     const passwordInputOnBlur = (e) => {
//         if (e.target.value.trim() === '') return setPasswordInputErrorMessage('Password cannot be empty!');
//         if (e.target.value.length < 6) return setPasswordInputErrorMessage('Password cannot contain less than 6 characters!');
//         if (!(/w*[a-zA-Z]\w*/).test(e.target.value)) return setPasswordInputErrorMessage('Password must contain at least one letter!');
//         if (!(/[\d]{1}/).test(e.target.value)) return setPasswordInputErrorMessage('Password must contain at least one number!');

//         setPasswordInputErrorMessage('');
//     }

//     const onSubmitLoginIn = (e) => {
//         e.preventDefault();

//         if (nameInputErrorMessage !== '', isEmailInputInvalid, passwordInputErrorMessage !== '') return;

//         loginStudentInDB(e.target[0].value, e.target[1].value)
//         .then((res) => {
//             dispatchUserData(loginAction({ user: res.user, token: res.token }));
//             saveUserOnCookie(res);
//             setHasLoginFailed(false);
//         })
//         .catch((err) => {
//             loginTeacherInDB(e.target[0].value, e.target[1].value)
//             .then((res) => {
//                 dispatchUserData(loginAction({ user: res.user, token: res.token }));
//                 saveUserOnCookie(res);
//                 setHasLoginFailed(false);
//             })
//             .catch((err) => {
//                 console.log(err);
//                 setHasLoginFailed(true);
//             });
//         });
//     }

//     return (
//         <div>
//             <form onSubmit={onSubmitLoginIn}>
//                 <input type="text" placeholder="Full name" onBlur={nameInputOnBlur}></input>
//                 { nameInputErrorMessage && <span>{nameInputErrorMessage}</span> }

//                 <input type="text" placeholder="Email" onBlur={emailInputOnBlur}></input>
//                 { isEmailInputInvalid && <span>Email is invalid!</span> }

//                 <input type="password" placeholder="Password" onBlur={passwordInputOnBlur}></input>
//                 { passwordInputErrorMessage !== '' && <span>{passwordInputErrorMessage}</span> }

//                 { hasSignupFailed && <span>Signup failed! Please try again</span> }
                
//                 <button type="submit" disabled={nameInputErrorMessage !== '' || isEmailInputInvalid || passwordInputErrorMessage !== ''}>Signup</button>
//             </form>
//         </div>
//     )
// };

// export default SignupForm;