// app/checkin/page.tsx
'use client';

import { useFetchUserOrderIDs, useFetchDetailsForMissingUserOrderIDs } from '../../utils/api';
import GridComponent from '../../components/Grid/Grid'; // Update the import path
import React, { useState } from 'react';
import ModalComponent from '../../components/Modal/Modal';

const CheckinPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const handleRowClick = (rowData) => {
        setSelectedRowData(rowData);
        setIsModalOpen(true);
    };

    const productId = 20787; // Replace with the actual product ID
    const { data: userOrderIDs, isLoading: isUserOrderIDsLoading, isError: isUserOrderIDsError } = useFetchUserOrderIDs(productId);

    const { data: userOrderDetails, isLoading: isUserOrderDetailsLoading, isError: isUserOrderDetailsError } = useFetchDetailsForMissingUserOrderIDs(productId, userOrderIDs || [], {
        enabled: !!userOrderIDs,
    });

    console.log('userOrderIDs:', userOrderIDs);
    console.log('userOrderDetails:', userOrderDetails);

    if (isUserOrderIDsLoading || isUserOrderDetailsLoading) {
        return <div>Loading...</div>;
    }

    if (isUserOrderIDsError || isUserOrderDetailsError) {
        return <div>Error occurred while fetching user data.</div>;
    }

    return (
        <div>
            <h1>Check-in</h1>
            <GridComponent rowData={userOrderDetails} onRowClick={handleRowClick} />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedData={selectedRowData}
                onUpdate={() => {}}
                onDelete={() => {}}
            />
        </div>

    );
};

export default CheckinPage;
