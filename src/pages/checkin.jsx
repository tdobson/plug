import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedRow, setAPIData, setGridData } from '../components/actions.jsx';
import Data from '../components/data.jsx';
import { Modal } from '@mui/material';


export default function CheckIn() {
    const selectedRow = useSelector((state) => state.selectedRow);
    const apiData = useSelector((state) => state.apiData); // Add this line

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    // Fetch the API data when the selectedRow changes
    React.useEffect(() => {
        if (selectedRow) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + authToken,
                            },
                            body: JSON.stringify(selectedRow.user_id),
                        }
                    );

                    const result = await response.json();

                    // Dispatch the setAPIData action with the fetched result
                    dispatch(setAPIData(result));
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [selectedRow, dispatch]);

    return (
        <>
            <h1 className="title">CheckIn!</h1>
            <div>
                {selectedRow && (
                    <>
                        <p>First Name: {selectedRow.first_name}</p>
                        <p>Last Name: {selectedRow.last_name}</p>
                        <p>Cabbage: {selectedRow.nickname}</p>
                        {apiData && (
                            <>
                                <p>API Data:</p>
                                <pre>{JSON.stringify(apiData, null, 2)}</pre>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
