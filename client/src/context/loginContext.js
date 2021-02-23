import React, { createContext, useReducer } from 'react';
import loginReducer, { initialUserDataState } from '../reducers/loginReducer';
import { getUserFromCookie } from '../cookies/userDataCookies.js';

export const LoginContext = createContext();

const LoginContextProvider = (props) => {
    const cookieUserData = getUserFromCookie();
    const [userDataState, dispatchUserData] = useReducer(loginReducer, cookieUserData || initialUserDataState);

    return (
        <LoginContext.Provider value={ { userDataState, dispatchUserData } }>
            { props.children }
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;