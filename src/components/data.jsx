import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, setGridData, setAPIData, setSelectedID } from './actions.jsx';
import ModalComponent from './modal.jsx';
import GridComponent from './grid.jsx';
import { fetchUserOrderIDs, fetchDetailsForMissingUserOrderIDs, sendOrderMeta } from '../api.jsx';
import { Button } from '@mui/material';

const Data = ({ product_id }) => {
    const dispatch = useDispatch();
    const rowData = useSelector((state) => state.gridData);
    const selectedRow = useSelector((state) => state.selectedRow);
    const eventAttendees = useSelector((state) => state.apiData);
    const selectedUserId = useSelector((state) => state.selectedID);

    const columnDefs = useMemo(
        () => [
            { field: 'first_name', headerName: 'First Name' },
            { field: 'last_name', headerName: 'Last Name' },
            { field: 'stats_attendance_indoor_wednesday_attended_cached', headerName: 'Attended' },
            {
                field: 'actions',
                headerName: 'Actions',
                cellRenderer: (params) => (
                    <Button variant="contained" size="medium" onClick={() => handleRowClick(params.data)}>Check In</Button>
                ),
            },
        ],
        []
    );

    const defaultColDef = useMemo(() => ({
        sortable: true,
    }), []);

    const fetchData = async () => {
        try {
            if (rowData.length > 0) {
                return rowData;
            }

            const userOrderIDs = await fetchUserOrderIDs(product_id);

            const allUserOrderIDsExist = userOrderIDs.every((id) =>
                rowData.some((row) => row.user_id === id)
            );

            if (!allUserOrderIDsExist) {
                const result = await fetchDetailsForMissingUserOrderIDs(product_id, userOrderIDs);
                const newRows = flattenData(result);
                dispatch(setAPIData(result));
                dispatch(setGridData([...rowData, ...newRows]));
                return [...rowData, ...newRows]; // Return the updated rowData
            }

            return rowData;
        } catch (error) {
            console.error(error);
        }
    };


    const flattenData = (result) => {
        const flattenedData = Object.entries(result).map(([user_id, data]) => ({
            user_id,
            ...data.user_meta,
            ...data.order_meta,
        }));
        return flattenedData;
    };

    useEffect(() => {
        fetchData();
    }, [product_id]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        if (selectedRow) {
            setSelectedData(eventAttendees[selectedRow.user_id]);
            dispatch(setSelectedID(selectedRow.user_id));
        }
    }, [selectedRow, eventAttendees]);

    const handleRowClick = (rowData) => {
        dispatch(setSelectedRow(rowData));
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleCheckIn = async () => {
        console.log("Mark checked in ", eventAttendees[selectedUserId].order_id);
        eventAttendees[selectedUserId].order_meta.cc_attendance = "attended";
        const response = await sendOrderMeta(eventAttendees[selectedUserId]);
        console.log(response); // Handle the response data as needed
        handleModalClose();
    };


    return (
        <div className="data-container">
            <GridComponent
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                handleRowClick={handleRowClick}
            />
            <ModalComponent
                isModalOpen={isModalOpen}
                handleModalClose={handleModalClose}
                handleCheckIn={handleCheckIn}
                selectedData={selectedData}
            />
        </div>
    );

};

export default Data;
