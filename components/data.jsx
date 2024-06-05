import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, setGridData, setAPIData, setSelectedID } from './actions.jsx';
import ModalComponent from './modal.jsx';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { fetchUserOrderIDs, fetchDetailsForMissingUserOrderIDs, sendOrderMeta } from '../api.jsx';

const Data = ({ product_id }) => {
    const dispatch = useDispatch();
    const rowData = useSelector((updated and refactoredstate) => state.gridData);
    const selectedRow = useSelector((state) => state.selectedRow);
    const eventAttendees = useSelector((state) => state.apiData);
    const selectedUserId = useSelector((state) => state.selectedID);

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
        eventAttendees[selectedUserId].order_meta.cc_attendance = "lol";
        const response = await sendOrderMeta(eventAttendees[selectedUserId]);
        console.log(response); // Handle the response data as needed
        handleModalClose();
    };

    return (
        <div className="data-container">
            <List>
                {rowData.map((row) => (
                    <ListItem key={row.user_id} button onClick={() => handleRowClick(row)}>
                        <ListItemText primary={`${row.first_name} ${row.last_name}`} secondary={`aka ${row.nickname}`} />
                    </ListItem>
                ))}
            </List>
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
