'use client';
// bookings/page.tsx

import React, { useState, useEffect } from 'react';
import { fetchVillas, fetchBookings } from '../../services/apiService';
import GridComponent from '../../components/Grid/Grid';
import ModalComponent from '../../components/Modal/Modal';
import { Booking, Villa } from '../../types/api';
import { Divider, Space } from "@mantine/core";

const BookingsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Booking | null>(null);
    const [villas, setVillas] = useState<Villa[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [startDate, setStartDate] = useState('2023-01-01'); // Default start date
    const [endDate, setEndDate] = useState('2023-12-31'); // Default end date

    useEffect(() => {
        async function loadData() {
            try {
                const villasData = await fetchVillas();
                const bookingsData = await fetchBookings();
                setVillas(villasData);
                setBookings(bookingsData);
            } catch (error) {
                console.error('Failed to load data', error);
            }
        }

        loadData();
    }, []);

    const handleRowClick = (rowData: Booking) => {
        setSelectedRowData(rowData);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedData: Booking) => {
        setSelectedRowData(null);
        setIsModalOpen(false);
        // Update local state
        setBookings(prev => prev.map(b => b.id === updatedData.id ? updatedData : b));
    };

    const handleDelete = (userId: string) => {
        // Logic to handle deletion
        setSelectedRowData(null);
        setIsModalOpen(false);
        setBookings(prev => prev.filter(b => b.uuid !== userId));
    };

    const handleDateSelect = (villa: Villa, date: Date) => {
        // Handle date selection logic
    };

    return (
        <div>
            <h1>Check-in</h1>
            <Space />
            <Divider />
            <GridComponent
                bookings={bookings}
                villas={villas}
                onDateSelect={handleDateSelect}
                startDate={startDate}
                endDate={endDate}
                rowData={bookings}
                onRowClick={handleRowClick}
                userOrderDetails={{}}
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedData={selectedRowData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                villas={villas}
                customers={[]}
            />
        </div>
    );
};

export default BookingsPage;
