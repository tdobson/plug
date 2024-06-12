// components/Modal/Modal.tsx
import React, { useState } from 'react';
import { Modal, Button, Text, Divider, Group, Badge, Space, Card } from '@mantine/core';
import { useSendOrderMeta } from '../../utils/api';
import { RowData } from '../../types/checkin';
import './Modal.css';
import { IconAlertCircle, IconMoodCheck, IconStar, IconUserCheck } from '@tabler/icons-react';

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

    const getLastClimbedText = () => {
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

        if (daysDifference <= 9) {
            return 'Last climbed with us in the past week';
        } else if (daysDifference <= 16) {
            return 'Last climbed with us in the past fortnight';
        } else if (daysDifference <= 30) {
            return 'Last climbed with us in the past month';
        } else if (daysDifference <= 90) {
            return 'Last climbed with us in the past 3 months';
        } else if (daysDifference <= 30000) {
            return 'It\'s been a while since they last climbed with us! Welcome them back :)';
        } else {
            return 'This is their first time climbing with us!';
        }
    };

    // Ensure stats_attendance_indoor_wednesday_attended_cached is treated as a number
    const attendance = selectedData?.user_meta?.stats_attendance_indoor_wednesday_attended_cached
        ? Number(selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached)
        : null;

    const showHappyBadgeIcon = (ccMember: string) => ccMember === 'yes';
    const showStarIcon = (committeeCurrent: string) => committeeCurrent && committeeCurrent !== 'retired' && committeeCurrent !== 'expired';
    const showFirstTimeIcon = (firstTimer: string) => !firstTimer || firstTimer.toLowerCase() !== 'no';

    const getVolunteerValueColor = (value: number) => {
        if (value > 54) return 'purple';
        if (value <= 20) return 'red';
        if (value <= 30) return 'orange';
        if (value <= 40) return 'green';
        return 'blue'; // Default color
    };

    return (
        <>
            <Modal opened={isOpen} onClose={onClose}  centered>
                {selectedData && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group align="center">
                            <Text size="lg" fw={500}>
                                {selectedData.user_meta.first_name} {selectedData.user_meta.last_name}
                            </Text>
                            {showHappyBadgeIcon(selectedData.user_meta.cc_member) && <IconMoodCheck size={24} color="blue" aria-label="Clan Member" />}
                            {showStarIcon(selectedData.user_meta.committee_current) && <IconStar size={24} color="gold" aria-label="Current Committee Member" />}
                            {showFirstTimeIcon(selectedData.user_meta['admin-first-timer-indoor']) && <IconUserCheck size={24} color="green" aria-label="First Timer" />}
                            <Text>(aka {selectedData.user_meta.nickname})</Text>
                        </Group>
                        <Space h="md" />
                        <Text fw={500}>Belaying Skills:</Text>
                        <div style={{ backgroundColor: getSkillBackgroundColor(), padding: '10px', borderRadius: '5px' }}>
                            <Text>{selectedData.user_meta['skills-belaying']}</Text>
                        </div>
                        {selectedData.order_meta.cc_volunteer !== 'none' && (
                            <>
                                <Space h="md" />
                                <Text fw={500}>Volunteering:</Text>
                                <Text>Helping with {selectedData.order_meta.cc_volunteer} this time.</Text>
                            </>
                        )}
                        {getLastClimbedText() && (
                            <>
                                <Space h="md" />
                                <Text  fw={500}>{getLastClimbedText()}</Text>
                            </>
                        )}
                        <Space h="lg" />
                        <Group >
                            {(selectedData.user_meta['admin-participation-statement-one'] === 'yes' && selectedData.user_meta['admin-participation-statement-two'] === 'yes') ? (
                                <Button onClick={handleUpdate}>They're here</Button>
                            ) : (
                                <>
                                    <IconAlertCircle size={24} color="red" aria-label="participation statement not agreed" />
                                    <Text>{selectedData.user_meta.first_name} hasn't completed all the mandatory disclaimers which we need filled in before they can climb.<br />Please direct them to www.climbingclan.com/edit<br />Once they've completed their disclaimers, you'll be able to check them in here.</Text>
                                </>
                            )}
                            <Button color="red" onClick={() => setShowNonAttendanceModal(true)}>
                                They're not coming
                            </Button>
                        </Group>
                        <Space h="lg" />

                        {attendance !== null && (
                            <>
                                <Divider my="md" />
                                {attendance === 0 && (
                                    <Text>
                                        {selectedData.user_meta.first_name} is here for the first time. Make them feel welcome!
                                    </Text>
                                )}
                                {attendance === 1 && (
                                    <Text>
                                        {selectedData.user_meta.first_name} is here for the second time - help us get to know them!
                                    </Text>
                                )}
                                {attendance === 2 && (
                                    <Text>
                                        {selectedData.user_meta.first_name} is here for the third time - welcome them back?
                                    </Text>
                                )}
                                <Divider my="md" />
                            </>
                        )}
                        <Group>

                            {selectedData.user_meta.scores_volunteer_value_cached && selectedData.user_meta.scores_volunteer_value_cached > 0 && (
                                <Badge color={getVolunteerValueColor(selectedData.user_meta.scores_volunteer_value_cached)} variant="light">
                                    Role Receptiveness: {selectedData.user_meta.scores_volunteer_value_cached}%
                                </Badge>
                            )}
                            {selectedData.user_meta.stats_volunteer_for_numerator_cached && (
                                <Badge color="blue" variant="light">
                                    Done {selectedData.user_meta.stats_volunteer_for_numerator_cached} roles
                                </Badge>
                            )}
                            {selectedData.user_meta.committee_current && selectedData.user_meta.committee_current.toLowerCase() !== 'retired' && (
                                <Badge color="blue" variant="light">
                                    Clan Committee Member: {selectedData.user_meta.committee_current}
                                </Badge>
                            )}
                            {selectedData.user_meta.cc_member && selectedData.user_meta.cc_member.toLowerCase() !== 'expired' && (
                                <Badge color="blue" variant="light">
                                    Active Clan Membership
                                </Badge>
                            )}
                        </Group>
                    </Card>
                )}
            </Modal>

            <Modal
                opened={showNonAttendanceModal}
                onClose={() => setShowNonAttendanceModal(false)}
                title="How did they not attend?"
            >
                <div className="button-container">
                    <Button fullWidth onClick={() => handleNonAttendance('cancelled')} className="wrap-button">
                        Did they let you know they<br /> weren't coming in advance?
                    </Button>
                    <Button fullWidth onClick={() => handleNonAttendance('late-bail')} className="wrap-button">
                        Did they let you know they<br /> weren't coming after 6pm?
                    </Button>
                    <Button fullWidth onClick={() => handleNonAttendance('noshow')} className="wrap-button">
                        Did they noshow?
                    </Button>
                    <Button fullWidth onClick={() => handleNonAttendance('duplicate')} className="wrap-button">
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
                <Button fullWidth onClick={() => handleVolunteerAttendance(true)} className="wrap-button">
                    Yes
                </Button>
                <Button fullWidth onClick={() => handleVolunteerAttendance(false)} className="wrap-button">
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
