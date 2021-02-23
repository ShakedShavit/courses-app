import React, { useEffect } from 'react'

const Notification = (props) => {
    const closeNotification = () => {
        props.setIsNotificationOpen(false);
    }

    useEffect(() => {
        setTimeout(() => {
            props.setIsNotificationOpen(false);
        }, 3000);
    }, []);

    return (
        <div className="notification-container">
            <span>{props.text}</span>
            <div className="close-notification-container"><span className="close-notification" onClick={closeNotification}>x</span></div>
        </div>
    )
}

export default Notification;