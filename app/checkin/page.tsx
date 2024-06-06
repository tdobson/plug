// app/checkin/page.tsx
'use client';

import { useFetchUserOrderIDs, useFetchDetailsForMissingUserOrderIDs } from '../../utils/api';
import GridComponent from '../../components/Grid/Grid'; // Update the import path

const CheckinPage = () => {
    const productId = 2118; // Replace with the actual product ID
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
            <GridComponent rowData={userOrderDetails} onRowClick={() => {}} />
        </div>
    );
};

export default CheckinPage;
