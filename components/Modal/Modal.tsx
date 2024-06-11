import React, { useState } from 'react';
import { Modal, Button, Text, Divider } from '@mantine/core';
import { useSendOrderMeta } from '../../utils/api';
import { RowData } from '../../types/checkin';
import './Modal.css';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    selectedData: RowData | null;
    onUpdate: (updatedData: RowData) => void;
    onDelete: (userId: string) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, selectedData, onUpdate, onDelete }) => {
    const { mutate: sendOrderMeta } = useSendOrderMeta();
    const [nonAttendanceReason, setNonAttendanceReason] = useState('');
    const [showNonAttendanceModal, setShowNonAttendanceModal] = useState(false);
    const [showUndoButton, setShowUndoButton] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);

    const handleUpdate = async () => {
        if (selectedData) {
            const updatedOrderMeta = {
                ...selectedData.order_meta,
                cc_attendance: 'attended',
                cc_checkin: true,
            };
            await sendOrderMeta({ ...selectedData, order_meta: updatedOrderMeta });
            onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
        }
    };

    const handleDelete = async () => {
        if (selectedData) {
            await sendOrderMeta({ ...selectedData, deleted: true });
            onDelete(selectedData.user_id);
        }
    };

    const handleNonAttendance = async (reason: string) => {
        if (selectedData) {
            const updatedOrderMeta = {
                ...selectedData.order_meta,
                cc_attendance: reason,
            };

            try {
                await sendOrderMeta({
                    user_id: selectedData.user_id,
                    order_id: selectedData.order_id,
                    order_meta: updatedOrderMeta,
                    order_status: 'processing',
                    user_meta: selectedData.user_meta,
                });
                onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
                onClose();
            } catch (error) {
                console.error('Error updating order meta:', error);
            }
        }
    };

    const handleVolunteerAttendance = async (attended: boolean) => {
        if (selectedData) {
            let updatedOrderMeta = {
                ...selectedData.order_meta,
                cc_volunteer_attendance: attended ? 'attended' : nonAttendanceReason,
            };
            await sendOrderMeta({ ...selectedData, order_meta: updatedOrderMeta });
            setShowVolunteerModal(false);
            setShowUndoButton(true);
            setTimeout(() => setShowUndoButton(false), 2000);
            onUpdate({ ...selectedData, order_meta: updatedOrderMeta });
        }
    };

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

        const lastClimbedDate = new Date(selectedData.user_meta.cc_compliance_last_date_of_climbing);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - lastClimbedDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference <= 7) {
            return 'lightgreen';
        } else if (daysDifference <= 30) {
            return 'lightyellow';
        } else if (daysDifference <= 60) {
            return 'lightcoral';
        } else {
            return 'lightgrey';
        }
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
                        <div style={{ backgroundColor: getSkillBackgroundColor(), padding: '10px', borderRadius: '5px' }}>
                            <Text>Belaying Skills: {selectedData.user_meta['skills-belaying']}</Text>
                        </div>
                        <div style={{ backgroundColor: getLastClimbedBackgroundColor(), padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                            <Text>Last Climbed: {selectedData.user_meta.cc_compliance_last_date_of_climbing}</Text>
                        </div>
                        <div>
                            {selectedData.order_meta.cc_volunteer !== 'none' && (
                                <>
                                    <Divider />
                                    <Text>
                                        Do you know what you're doing to help with {selectedData.order_meta.cc_volunteer}{' '}
                                        this time?
                                    </Text>
                                </>
                            )}
                            {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached === 0 && (
                                <>
                                    <Divider />
                                    <Text>
                                        First time attendee - {selectedData.user_meta.first_name} is here for the first
                                        time. Make them feel welcome!
                                    </Text>
                                </>
                            )}
                            {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached === 1 && (
                                <>
                                    <Divider />
                                    <Text>
                                        Second time attendee - {selectedData.user_meta.first_name} is here for the second
                                        time - help us get to know them. Ask them a question?
                                    </Text>
                                </>
                            )}
                            {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached === 2 && (
                                <>
                                    <Divider />
                                    <Text>
                                        Third time attendee - {selectedData.user_meta.first_name} is here for the third
                                        time - welcome them back?
                                    </Text>
                                </>
                            )}
                            <Divider />
                            <Button onClick={handleUpdate}>Mark Checked In</Button>
                            <Divider />
                            <Button color="red" onClick={() => setShowNonAttendanceModal(true)}>
                                Mark non-attendance
                            </Button>
                        </div>
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
                        Did they let you know they<br /> weren't coming in advance?
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => handleNonAttendance('late-bail')}
                        className="wrap-button"
                    >
                        Did they let you know they<br/> weren't coming after 6pm?
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
                        Is this a duplicate signup?
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
