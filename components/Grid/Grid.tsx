import React from 'react';
import { Table } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { Booking, Villa } from '../../types/api';
import { generateDateRange } from '../../utils/dateUtils';

const useStyles = createStyles((theme) => ({
    bookedCell: {
        backgroundColor: theme.colors.red[5],
        color: theme.white,
    },
    unbookedCell: {
        backgroundColor: theme.colors.green[5],
        color: theme.white,
    },
    cell: {
        cursor: 'pointer',
    },
}));

interface GridComponentProps {
    bookings: Booking[];
    villas: Villa[];
    onDateSelect: (villa: Villa, date: Date) => void;
    startDate: string;
    endDate: string;
    rowData: Booking[];
    onRowClick: (rowData: Booking) => void;
    userOrderDetails: object; // or the appropriate type
}

const GridComponent: React.FC<GridComponentProps> = ({
                                                         bookings,
                                                         villas,
                                                         onDateSelect,
                                                         startDate,
                                                         endDate,
                                                         rowData,
                                                         onRowClick,
                                                         userOrderDetails
                                                     }) => {
    const { classes } = useStyles();
    const dates = generateDateRange(startDate, endDate);

    const bookingsByDate: Record<string, Record<string, Booking>> = {};
    bookings.forEach((booking) => {
        generateDateRange(booking.start_date, booking.end_date).forEach((date) => {
            const dateKey = date.toDateString();
            if (!bookingsByDate[dateKey]) {
                bookingsByDate[dateKey] = {};
            }
            bookingsByDate[dateKey][booking.villa_uuid] = booking;
        });
    });

    const handleCellClick = (villa: Villa, date: Date) => {
        onDateSelect(villa, date);
    };

    return (
        <Table>
            <thead>
            <tr>
                <th>Date</th>
                {villas.map((villa) => (
                    <th key={villa.uuid}>{villa.name}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {dates.map((date) => (
                <tr key={date.toDateString()}>
                    <td>{date.toDateString()}</td>
                    {villas.map((villa) => (
                        <td
                            key={villa.uuid}
                            className={`${classes.cell} ${
                                bookingsByDate[date.toDateString()]?.[villa.uuid]
                                    ? classes.bookedCell
                                    : classes.unbookedCell
                            }`}
                            onClick={() => handleCellClick(villa, date)}
                        >
                            {bookingsByDate[date.toDateString()]?.[villa.uuid]?.id ?? ''}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default GridComponent;
