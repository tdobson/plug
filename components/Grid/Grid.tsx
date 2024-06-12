import React from 'react';
import { Grid, Text, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RowData } from '../../types/checkin';
import { IconAlertCircle } from '@tabler/icons-react'; // Make sure to install @tabler/icons-react

interface GridComponentProps {
    rowData: RowData[];
    onRowClick: (rowData: RowData) => void;
}

const GridComponent: React.FC<GridComponentProps> = ({ rowData, onRowClick }) => {
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

    return (
        <Grid>
            {rowData.map((userData) => (
                <Grid.Col key={userData.user_id} span={getColSpan()} onClick={() => handleRowClick(userData)}>
                    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <Text fw={500} size="lg" style={{ marginRight: '8px' }}>
                                {userData.user_meta.first_name} {userData.user_meta.last_name}
                            </Text>
                            {(userData.user_meta['admin-participation-statement-one'] !== 'yes' || userData.user_meta['admin-participation-statement-two'] !== 'yes') && (
                                <IconAlertCircle size={24} color="red" aria-label="participation statement not agreed" />
                            )}
                        </div>
                        <Text size="sm" color="dimmed" mb={8}>
                            Facebook Name: {userData.user_meta.nickname}
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <Badge color={getAttendanceTimesColor(userData.user_meta.stats_attendance_attended_cached)} variant="light">
                                Attended: {userData.user_meta.stats_attendance_attended_cached} times
                            </Badge>

                            {userData.user_meta.scores_attendance_reliability_score_cached && (
                                <Badge color={getAttendanceReliabilityColor(Number(userData.user_meta.scores_attendance_reliability_score_cached))} variant="light">
                                    Attendance Reliability: {userData.user_meta.scores_attendance_reliability_score_cached}%
                                </Badge>
                            )}
                            {userData.order_meta.cc_volunteer !== 'none' && (
                                <Badge color="grape" variant="light">
                                    Volunteering this time as: {userData.order_meta.cc_volunteer}
                                </Badge>
                            )}
                        </div>
                    </div>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default GridComponent;
