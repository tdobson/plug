// components/Modal/Modal.tsx
import React, { useState } from 'react';
import { Modal, Button, Text, Divider } from '@mantine/core';
import { useSendOrderMeta } from '../../utils/api';
import './Modal.css';

const ModalComponent = ({ isOpen, onClose, selectedData, onUpdate, onDelete }) => {
    const { mutate: sendOrderMeta } = useSendOrderMeta();
    const [nonAttendanceReason, setNonAttendanceReason] = useState('');
    const [showNonAttendanceModal, setShowNonAttendanceModal] = useState(false);
    const [showUndoButton, setShowUndoButton] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);

    const getSkillBackgroundColor = () => {
        if (!selectedData || !selectedData.user_meta || !selectedData.user_meta['skills-belaying']) {
            return ''; // Return empty string for default background color
        }

        const skillsBelaying = selectedData.user_meta['skills-belaying'];
        if (skillsBelaying === 'lead-belayer') {
            return 'palegreen';
        } else if (skillsBelaying === 'Top-rope-belaying') {
            return 'cyan';
        } else if (skillsBelaying === 'learner-lead-belayer') {
            return 'yellow';
        } else if (skillsBelaying === 'No-Belaying') {
            return 'red';
        }

        return ''; // Empty string for default background color
    };

    const getLastClimbedBackgroundColor = () => {
        if (
            !selectedData ||
            !selectedData.user_meta ||
            !selectedData.user_meta.cc_compliance_last_date_of_climbing
        ) {
            return ''; // Return empty string for default background color
        }

        const lastDateOfClimbing = new Date(selectedData.user_meta.cc_compliance_last_date_of_climbing);
        const today = new Date();
        const daysDifference = Math.floor((today - lastDateOfClimbing) / (1000 * 60 * 60 * 24));

        if (daysDifference > 60) {
            return 'lightblue'; // Return light blue for more than 60 days difference
        }

        return ''; // Empty string for default background color
    };

    const listItemStyle = {
        backgroundColor: getSkillBackgroundColor() || getLastClimbedBackgroundColor(),
    };

    const handleUpdate = async () => {
        const updatedOrderMeta = {
            ...selectedData.order_meta,
            cc_attendance: 'attended',
            cc_checkin: true,
        };
        await sendOrderMeta({ ...selectedData, order_meta: updatedOrderMeta });
        onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
    };

    const handleDelete = async () => {
        await sendOrderMeta({ ...selectedData, deleted: true });
        onDelete(selectedData.user_id);
    };

    const handleNonAttendance = async (reason) => {
        const updatedOrderMeta = {
            ...selectedData.order_meta,
            cc_attendance: reason,
        };
        await sendOrderMeta({ ...selectedData, order_meta: updatedOrderMeta });
        setNonAttendanceReason(reason);
        setShowNonAttendanceModal(false);

        if (selectedData.order_meta.cc_volunteer !== 'none') {
            setShowVolunteerModal(true);
        } else {
            setShowUndoButton(true);
            setTimeout(() => setShowUndoButton(false), 2000);
            onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
        }
    };

    const handleVolunteerAttendance = async (attended) => {
        let updatedOrderMeta = {
            ...selectedData.order_meta,
            cc_volunteer_attendance: attended ? 'attended' : nonAttendanceReason,
        };
        await sendOrderMeta({ ...selectedData, order_meta: updatedOrderMeta });
        setShowVolunteerModal(false);
        setShowUndoButton(true);
        setTimeout(() => setShowUndoButton(false), 2000);
        onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
    };

    return (
        <>
            <Modal opened={isOpen} onClose={onClose} title="Let's get checked in">
                {selectedData && (
                    <>
                        <Text>
                            {selectedData.user_meta.first_name} {selectedData.user_meta.last_name} (aka{' '}
                            {selectedData.user_meta.nickname})
                        </Text>
                        <div>
                            {selectedData.order_meta.cc_volunteer !== 'none' && (
                                <>
                                    <Divider />
                                    <Text>
                                        You know what you're doing to help with {selectedData.order_meta.cc_volunteer}{' '}
                                        this time?
                                    </Text>
                                </>
                            )}
                            {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached === '0' && (
                                <>
                                    <Divider />
                                    <Text>
                                        First time attendee - {selectedData.user_meta.first_name} is here for the first
                                        time
                                    </Text>
                                </>
                            )}
                            <Divider />
                            <Text className="list-item" style={listItemStyle}>
                                This is the color wristband to give: {selectedData.user_meta['skills-belaying']}
                            </Text>
                            <Divider />
                            {getLastClimbedBackgroundColor() === 'lightblue' && (
                                <>
                                    <Text className="list-item" style={listItemStyle}>
                                        Good to have you back - It's been some time since you last climbed with us
                                    </Text>
                                </>
                            )}
                            <Divider />
                            {/* Add more text elements for other properties as needed */}
                        </div>
                        <Button onClick={handleUpdate}>Mark Checked In</Button>
                        <Button color="red" onClick={() => setShowNonAttendanceModal(true)}>
                            Mark non-attendance
                        </Button>
                    </>
                )}
            </Modal>

            <Modal
                opened={showNonAttendanceModal}
                onClose={() => setShowNonAttendanceModal(false)}
                title="How did they not attend?"
            >
                <div className="button-container">
                    <Button
                        fullWidth
                        onClick={() => handleNonAttendance('cancelled')}
                        className="wrap-button"
                    >
                        Did they let you know they weren't coming in advance?
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => handleNonAttendance('late-bail')}
                        className="wrap-button"
                    >
                        Did they let you know they weren't coming after 6pm?
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => handleNonAttendance('noshow')}
                        className="wrap-button"
                    >
                        Did they noshow?
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => handleNonAttendance('duplicate')}
                        className="wrap-button"
                    >
                        Is this a duplicate order?
                    </Button>
                </div>
            </Modal>

            <Modal
                opened={showVolunteerModal}
                onClose={() => setShowVolunteerModal(false)}
                title="Did they do their role?"
            >
                <Text>Did they do their role of {selectedData?.order_meta?.cc_volunteer} for this event?</Text>
                <Button
                    fullWidth
                    onClick={() => handleVolunteerAttendance(true)}
                    className="wrap-button"
                >
                    Yes
                </Button>
                <Button
                    fullWidth
                    onClick={() => handleVolunteerAttendance(false)}
                    className="wrap-button"
                >
                    No
                </Button>
            </Modal>

            {showUndoButton && (
                <Text>
                    Sending response "{nonAttendanceReason}"...
                    <Button onClick={() => setShowUndoButton(false)}>Undo</Button>
                </Text>
            )}
        </>
    );
};

export default ModalComponent;
