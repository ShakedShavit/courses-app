import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { logoutAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { deleteUserFromCookie } from '../../cookies/userDataCookies';
import ChangePasswordModal from '../user/ChangePasswordModal';
import Notification from './Notification';

const Header = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangePasswordNoticeOpen, setIsChangePasswordNoticeOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');

    const history = useHistory();

    const logoutOnClick = () => {
        dispatchUserData(logoutAction());
        deleteUserFromCookie();
        history.push('/home');
    }

    const openChangePasswordModalOnClick = () => {
        setIsChangePasswordModalOpen(true);
    }

    return (
        <div className="header">
            {
                !!userDataState.user ?
                <div className="header-content-container">
                    <div className="header-content">
                        <NavLink to='/home' className="header-link" activeClassName="active-header-link">Home</NavLink>

                        <span className="header-greeting-text">Hello {userDataState.user.fullName}</span>
                    </div>
                    <div className="header-content header-buttons-container">
                        <button onClick={openChangePasswordModalOnClick} className="change-password-button">Change password</button>
                        <button onClick={logoutOnClick}>Logout</button>
                    </div>
                </div>:
                <div className="header-content-container__no-user">
                    

                    <div className="bg"></div>
                    <div className="bg bg2"></div>
                    <div className="bg bg3"></div>
                    <div className="content">
                        <NavLink to='/home' className="header-link" activeClassName="active-header-link">Home</NavLink>
                        <NavLink to="/login" className="header-link" activeClassName="active-header-link">Login</NavLink>
                    </div>
                </div>
            }
            { isChangePasswordModalOpen && <ChangePasswordModal
                setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
                setIsChangePasswordNoticeOpen={setIsChangePasswordNoticeOpen}
                setNotificationText={setNotificationText}
            /> }
            { isChangePasswordNoticeOpen && <Notification text={notificationText} setIsNotificationOpen={setIsChangePasswordNoticeOpen} /> }
        </div>
    )
};

export default Header;