// components/Grid/GridComponent.tsx
import React from 'react';
import { Grid, Text, Badge, Card, Group, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RowData } from '../../types/api';
import {IconAlertCircle, IconMoodCheck, IconStar, IconUserCheck } from '@tabler/icons-react'; // Make sure to install @tabler/icons-react

interface GridComponentProps {
    rowData: RowData[];
    onRowClick: (rowData: RowData) => void;
    userOrderDetails: Record<string, RowData>;
}

const GridComponent: React.FC<GridComponentProps> = ({ rowData, onRowClick, userOrderDetails }) => {
    const handleRowClick = (rowData: RowData) => {
        onRowClick(rowData);
    };

    // Media queries to adjust column span based on screen size
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    const getColSpan = () => {
        if (isMobile) return 12; // Full width on mobile
        if (isTablet) return 6; // Two columns on tablets
        return 4; // Three columns on desktop
    };

    const getAttendanceReliabilityColor = (score: number) => {
        if (score > 95) return 'green';
        if (score > 90) return 'orange';
        return 'red';
    };

    const getAttendanceTimesColor = (times: number) => {
        if (times > 10) return 'green';
        if (times > 5) return 'orange';
        return 'red';
    };

    const getVolunteerValueColor = (value: number) => {
        if (value > 54) return 'purple';
        if (value <= 20) return 'red';
        if (value <= 30) return 'orange';
        if (value <= 40) return 'green';
        return 'blue'; // Default color
    };

    const showHappyBadgeIcon = (ccMember: string) => ccMember === 'yes';
    const showStarIcon = (committeeCurrent: string) => committeeCurrent && committeeCurrent !== 'retired' && committeeCurrent !== 'expired';
    const showFirstTimeIcon = (firstTimer: string) => !firstTimer || firstTimer.toLowerCase() !== 'no';

    return (
        <Grid>
            {rowData.map((userData) => (
                <Grid.Col key={userData.user_id} span={getColSpan()} onClick={() => handleRowClick(userData)}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                        <Group align="center" mb="sm">
                            <Text fw={500} size="lg">
                                {userData.user_meta.first_name} {userData.user_meta.last_name}
                            </Text>
                            {userData.user_meta['admin-participation-statement-one'] !== 'yes' || userData.user_meta['admin-participation-statement-two'] !== 'yes' ? (
                                <IconAlertCircle size={24} color="red" aria-label="participation statement not agreed" />
                            ) : null}
                            {showHappyBadgeIcon(userData.user_meta.cc_member) && <IconMoodCheck size={24} color="blue" aria-label="Clan Member" />}
                            {showStarIcon(userData.user_meta.committee_current) && <IconStar size={24} color="gold" aria-label="Current Committee Member" />}
                            {showFirstTimeIcon(userData.user_meta['admin-first-timer-indoor']) && <IconUserCheck size={24} color="green" aria-label="First Timer" />}


                        </Group>

                        <Text size="sm" color="dimmed">
                            Facebook Name: {userData.user_meta.nickname}
                        </Text>
                        </Card.Section><Card.Section>
                        <Space h="md" />
                        <Group  mb="sm">
                            <Badge color={getAttendanceTimesColor(Number(userData.user_meta.stats_attendance_attended_cached))} variant="light">
                                Attended: {userData.user_meta.stats_attendance_attended_cached} times
                            </Badge>
                            {userData.user_meta.scores_attendance_reliability_score_cached && (
                                <Badge color={getAttendanceReliabilityColor(Number(userData.user_meta.scores_attendance_reliability_score_cached))} variant="light">
                                    Attendance Reliability: {userData.user_meta.scores_attendance_reliability_score_cached}%
                                </Badge>
                            )}
                            {userData.order_meta.cc_volunteer !== 'none' && (
                                <Badge color="grape" variant="light">
                                    Role this time as: {userData.order_meta.cc_volunteer}
                                </Badge>
                            )}
                        </Group>
                       </Card.Section>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default GridComponent;
