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

    const productId = '20787'; // Replace with the actual product ID
    const { data: userOrderIDs, isLoading: isUserOrderIDsLoading, isError: isUserOrderIDsError } = useFetchUserOrderIDs(productId);
    const { data: userOrderDetails, isLoading: isUserOrderDetailsLoading, isError: isUserOrderDetailsError } = useFetchDetailsForMissingUserOrderIDs(productId, userOrderIDs || [], {
        enabled: !!userOrderIDs,
    });

    if (isUserOrderIDsLoading || isUserOrderDetailsLoading) {
        return <div>Loading...</div>;
    }

    if (isUserOrderIDsError || isUserOrderDetailsError) {
        return <div>Error occurred while fetching user data.</div>;
    }

    const sortedUserOrderDetails = userOrderDetails
        ? Object.values(userOrderDetails as Record<string, RowData>).sort((a, b) => a.user_meta.first_name.localeCompare(b.user_meta.first_name))
        : [];

    return (
        <div>
            <h1>Check-in</h1>
            <GridComponent rowData={sortedUserOrderDetails} onRowClick={handleRowClick} />
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

export default CheckInPage;
