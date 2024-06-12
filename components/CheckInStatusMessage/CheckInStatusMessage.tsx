// components/CheckInStatusMessage.tsx
import React, { useEffect, useState } from 'react';
import { RowData } from '../../types/checkin';

interface CheckInStatusMessageProps {
    userOrderDetails: Record<string, RowData>;
}

const CheckInStatusMessage: React.FC<CheckInStatusMessageProps> = ({ userOrderDetails }) => {
    const [message, setMessage] = useState('');

    const getPendingCount = () => {
        return Object.values(userOrderDetails).filter(user => user.order_meta.cc_attendance === 'pending').length;
    };

    const hasSpecialConditions = () => {
        return Object.values(userOrderDetails).some(user =>
            user.order_meta.cc_attendance === 'pending' &&
            user.user_meta['skills-belaying'] !== 'no-belaying' &&
            user.user_meta['admin-first-timer-indoor'] !== undefined &&
            user.user_meta['admin-first-timer-indoor'] !== null
        );
    };

    useEffect(() => {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const pendingCount = getPendingCount();

        let newMessage = '';

        if (day === 3) { // Wednesday
            if (hours < 18 || (hours === 18 && minutes < 20)) {
                newMessage = "Arrive early to have check-in setup and working at 6:40pm";
            } else if (hours === 18 && minutes >= 20 && minutes < 55) {
                newMessage = "Time to start getting check-in set up";
            } else if (hours === 18 && minutes >= 55) {
                if (pendingCount > 0 && !hasSpecialConditions()) {
                    newMessage = "It's time to close down check-in now and head to pairing. Thanks for your help";
                }
            } else if (hours === 19 && minutes < 5) {
                newMessage = `Check-in closes in ${65 - minutes} minutes`;
            } else if (hours === 19 && minutes === 5 && pendingCount > 0) {
                newMessage = "It's time to close down check-in now and head to pairing yourself. Thanks for your help";
            }
        } else if (hours >= 20) {
            newMessage = "Remember to mark non-attendance on any people who didn't show";
        } else {
            newMessage = `${pendingCount} people still to arrive`;
        }

        setMessage(newMessage);
    }, [userOrderDetails]);

    return <div>{message}</div>;
};

export default CheckInStatusMessage;
