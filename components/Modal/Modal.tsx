// components/Modal/Modal.tsx
import React from 'react';
import { Modal, Button, Text, List, Divider } from '@mantine/core';
import { useSendOrderMeta } from '../../utils/api';

const ModalComponent = ({ isOpen, onClose, selectedData, onUpdate, onDelete }) => {
    const { mutate: sendOrderMeta } = useSendOrderMeta();

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

    const handleUpdate = async (updatedData) => {
        await sendOrderMeta(updatedData);
        onUpdate(updatedData);
    };

    const handleDelete = async () => {
        await sendOrderMeta({ ...selectedData, deleted: true });
        onDelete(selectedData.user_id);
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title="Check In">
            {selectedData && (
                <>
                    <Text>
                        {selectedData.user_meta.first_name} {selectedData.user_meta.last_name} (aka{' '}
                        {selectedData.user_meta.nickname})
                    </Text>
                    <List>
                        {selectedData.order_meta.cc_volunteer !== 'none' && (
                            <>
                                <Divider />
                                <List.Item>
                                    <Text>
                                        You know what you're doing to help with {selectedData.order_meta.cc_volunteer}{' '}
                                        this time?
                                    </Text>
                                </List.Item>
                            </>
                        )}
                        {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached === '0' && (
                            <>
                                <Divider />
                                <List.Item>
                                    <Text>
                                        First time attendee - {selectedData.user_meta.first_name} is here for the first
                                        time
                                    </Text>
                                </List.Item>
                            </>
                        )}
                        <Divider />
                        <List.Item style={listItemStyle}>
                            <Text>
                                This is the color wristband to give: {selectedData.user_meta['skills-belaying']}
                            </Text>
                        </List.Item>
                        <Divider />
                        {getLastClimbedBackgroundColor() === 'lightblue' && (
                            <>
                                <List.Item style={listItemStyle}>
                                    <Text>
                                        Good to have you back - It's been some time since you last climbed with us
                                    </Text>
                                </List.Item>
                            </>
                        )}
                        <Divider />
                        {/* Add more List.Items for other properties as needed */}
                    </List>
                    <Button onClick={() => handleUpdate(selectedData)}>Mark Checked In</Button>
                    <Button color="red" onClick={handleDelete}>
                        Mark non-attendance
                    </Button>
                </>
            )}
        </Modal>
    );
};

export default ModalComponent;
