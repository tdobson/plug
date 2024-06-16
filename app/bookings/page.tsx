'use client';

import React, { useState, useEffect } from 'react';
import { fetchVillas, fetchBookings } from '../../services/apiService';
import GridComponent from '../../components/Grid/Grid';
import ModalComponent from '../../components/Modal/Modal';
import { Booking, Villa } from '../../types/api';
import { Divider, Space } from "@mantine/core";

const CheckInPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Booking | null>(null);
    const [villas, setVillas] = useState<Villa[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

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

    return (
        <div>
            <h1>Check-in</h1>
            <Space />
            <Divider />
            <GridComponent rowData={bookings} onRowClick={handleRowClick} userOrderDetails={{}} />
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

export default CheckInPage;
