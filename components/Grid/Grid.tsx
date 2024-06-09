// components/Grid/Grid.tsx
import React from 'react';
import { Grid, Text, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { RowData } from '../../types/checkin';

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

    return (
        <Grid>
            {rowData.map((userData) => (
                <Grid.Col key={userData.user_id} span={getColSpan()} onClick={() => handleRowClick(userData)}>
                    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Text fw={500} size="lg" mb={8}>
                            {userData.user_meta.first_name} {userData.user_meta.last_name}
                        </Text>
                        <Text size="sm" color="dimmed" mb={8}>
                            Facebook Name: {userData.user_meta.nickname}
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <Badge color="blue" variant="light">
                                Attended: {userData.user_meta.stats_attendance_attended_cached} times
                            </Badge>

                            <Badge color="orange" variant="light">
                                Attendance Reliability: {userData.user_meta.scores_attendance_reliability_score_cached}%
                            </Badge>
                            <Badge color="grape" variant="light">
                                Volunteering tonight as: {userData.order_meta.cc_volunteer}
                            </Badge>
                        </div>
                    </div>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default GridComponent;
