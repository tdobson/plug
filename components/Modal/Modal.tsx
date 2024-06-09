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
                    user_id: selectedData.user_id, // Add the user_id property
                    order_id: selectedData.order_id,
                    order_meta: updatedOrderMeta,
                    order_status: 'processing',
                    user_meta: selectedData.user_meta, // Add the user_meta property
                });
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
                            <Button onClick={handleUpdate}>Mark Checked In</Button>
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
