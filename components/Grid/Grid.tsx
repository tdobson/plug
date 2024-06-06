// components/Grid/Grid.tsx
import React from 'react';
import { Grid, Text, Badge } from '@mantine/core';

const GridComponent = ({ rowData, onRowClick }) => {
    const handleRowClick = (rowData) => {
        onRowClick(rowData);
    };

    return (
        <Grid>
            {Object.entries(rowData).map(([userId, userData]) => (
                <Grid.Col key={userId} span={4} onClick={() => handleRowClick(userData)}>
                    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Text weight={500} size="lg" mb={8}>
                            {userData.user_meta.first_name} {userData.user_meta.last_name}
                        </Text>
                        <Text size="sm" color="dimmed" mb={8}>
                            Nickname: {userData.user_meta.nickname}
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <Badge color="blue" variant="light">
                                Attendance: {userData.user_meta.stats_attendance_attended_cached}
                            </Badge>
                            <Badge color="green" variant="light">
                                Belaying: {userData.user_meta['skills-belaying']}
                            </Badge>
                            <Badge color="orange" variant="light">
                                Attendance Reliability: {userData.user_meta.scores_attendance_reliability_score_cached}%
                            </Badge>
                            <Badge color="grape" variant="light">
                                Volunteer Reliability: {userData.user_meta.scores_volunteer_reliability_score_cached}%
                            </Badge>
                        </div>
                        <Text size="sm" mb={4}>
                            Can Help With: {userData.user_meta['admin-can-you-help']}
                        </Text>
                        <Text size="sm" mb={4}>
                            Leading Grades: {userData.user_meta['climbing-indoors-leading-grades']}
                        </Text>
                        <Text size="sm" mb={4}>
                            Top Roping Grades: {userData.user_meta['climbing-indoors-toproping-grades']}
                        </Text>
                        <Text size="sm">
                            Skills Passing On: {userData.user_meta['climbing-indoors-skills-passing-on']}
                        </Text>
                    </div>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default GridComponent;
