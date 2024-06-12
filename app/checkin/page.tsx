// app/checkin/page.tsx
'use client';

import React, { useState } from 'react';
import { useFetchUserOrderIDs, useFetchDetailsForMissingUserOrderIDs } from '../../utils/api';
import GridComponent from '../../components/Grid/Grid';
import ModalComponent from '../../components/Modal/Modal';
import { RowData } from '../../types/checkin';

const CheckInPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<RowData | null>(null);

    const handleRowClick = (rowData: RowData) => {
        setSelectedRowData(rowData);
        setIsModalOpen(true);
    };

    const productId = '20256'; // Replace with the actual product ID
    console.log('Product ID:', productId);
    const { data: userOrderIDs, isLoading: isUserOrderIDsLoading, isError: isUserOrderIDsError } = useFetchUserOrderIDs(productId);
    const { data: userOrderDetails, isLoading: isUserOrderDetailsLoading, isError: isUserOrderDetailsError } = useFetchDetailsForMissingUserOrderIDs(productId, userOrderIDs || [], {
        enabled: !!userOrderIDs,
    });
    console.log('User Order IDs:', userOrderIDs);
    console.log('User Order Details:', userOrderDetails);

    if (isUserOrderIDsLoading || isUserOrderDetailsLoading) {
        return <div>Loading...</div>;
    }

    if (isUserOrderIDsError || isUserOrderDetailsError) {
        return <div>Error occurred while fetching user data.</div>;
    }
    console.log('Is User Order IDs Loading:', isUserOrderIDsLoading);
    console.log('Is User Order IDs Error:', isUserOrderIDsError);
    console.log('Is User Order Details Loading:', isUserOrderDetailsLoading);
    console.log('Is User Order Details Error:', isUserOrderDetailsError);

    const isValidUserOrderDetails = (details: any): details is Record<string, RowData> => {
        if (typeof details !== 'object' || details === null) return false;

        return Object.values(details).every((detail: any, index) => {
            const valid = (
                typeof detail.user_id === 'number' &&
                typeof detail.order_id === 'number' &&
                typeof detail.order_status === 'string' &&
                detail.user_meta && typeof detail.user_meta === 'object' &&
                detail.order_meta && typeof detail.order_meta === 'object'
            );
            if (!valid) {
                console.error(`Validation failed at index ${index}:`, detail);
            }
            return valid;
        });
    };

    if (!isValidUserOrderDetails(userOrderDetails)) {
        console.error('Invalid data structure received:', userOrderDetails);
        return <div>Invalid data structure received. Please check the console for details.</div>;
    }

    // Filter userOrderDetails based on cc_attendance
    const filteredUserOrderDetails = Object.values(userOrderDetails).filter(user => user.order_meta.cc_attendance === 'pending');

    const sortedUserOrderDetails = filteredUserOrderDetails.sort((a, b) =>
        a.user_meta.first_name.localeCompare(b.user_meta.first_name)
    );

    const handleUpdate = (updatedData: RowData) => {
        setSelectedRowData(null);
        setIsModalOpen(false);
        // Re-fetch or update state logic to reflect the change in attendance status
    };

    const handleDelete = (userId: string) => {
        // Logic to handle deletion
        setSelectedRowData(null);
        setIsModalOpen(false);
        // Re-fetch or update state logic to reflect the deletion
    };

    return (
        <div>
            <h1>Check-in</h1>
            <GridComponent rowData={sortedUserOrderDetails} onRowClick={handleRowClick} />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedData={selectedRowData}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default CheckInPage;
