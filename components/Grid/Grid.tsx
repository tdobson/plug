import React from 'react';
import { Grid, Text, Badge, Card, Group, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Booking } from '../../types/api';
import { IconAlertCircle, IconMoodCheck, IconStar, IconUserCheck } from '@tabler/icons-react'; // Make sure to install @tabler/icons-react

interface GridComponentProps {
    rowData: Booking[];
    onRowClick: (rowData: Booking) => void;
    userOrderDetails: Record<string, Booking>;
}

const GridComponent: React.FC<GridComponentProps> = ({ rowData, onRowClick, userOrderDetails }) => {
    const handleRowClick = (rowData: Booking) => {
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
            {rowData.map((booking) => (
                <Grid.Col key={booking.id} span={getColSpan()} onClick={() => handleRowClick(booking)}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group align="center" mb="sm">
                                <Text fw={500} size="lg">
                                    {booking.customer_uuid}
                                </Text>
                                <IconAlertCircle size={24} color="red" aria-label="participation statement not agreed" />
                                <IconMoodCheck size={24} color="blue" aria-label="Clan Member" />
                                <IconStar size={24} color="gold" aria-label="Current Committee Member" />
                                <IconUserCheck size={24} color="green" aria-label="First Timer" />
                            </Group>
                            <Text size="sm" color="dimmed">
                                Villa: {booking.villa_uuid}
                            </Text>
                        </Card.Section>
                        <Card.Section>
                            <Space h="md" />
                            <Group mb="sm">
                                <Badge color="green" variant="light">
                                    Start Date: {booking.start_date}
                                </Badge>
                                <Badge color="blue" variant="light">
                                    End Date: {booking.end_date}
                                </Badge>
                                <Badge color="grape" variant="light">
                                    Status: {booking.status}
                                </Badge>
                            </Group>
                        </Card.Section>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default GridComponent;
