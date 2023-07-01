import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDispatch, useSelector } from 'react-redux';
import {setSelectedRow, setGridData, setAPIData, setSelectedID} from './actions.jsx';
import { Button, Modal, Box, Typography } from '@mui/material';

const authToken = "geeboh7Jeengie8uS1chaiqu";

const Data = ({ product_id }) => {
    const dispatch = useDispatch();
    const rowData = useSelector((state) => state.gridData);
    const selectedRow = useSelector((state) => state.selectedRow);
    const apiData = useSelector((state) => state.apiData);

    const columnDefs = useMemo(
        () => [
            { field: 'first_name', headerName: 'First Name' },
            { field: 'last_name', headerName: 'Last Name' },
            { field: 'stats_attendance_indoor_wednesday_attended_cached', headerName: 'Attended' },
            {
                field: 'actions',
                headerName: 'Actions',
                cellRendererFramework: (params) => (
                    <Button onClick={() => handleRowClick(params.data)}>Check In</Button>
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

            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken,
            };

            const response = await fetch(
                `https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${product_id}`,
                {
                    headers: headers,
                }
            );
            const userOrderIDs = await response.json();

            const allUserOrderIDsExist = userOrderIDs.every((id) =>
                rowData.some((row) => row.user_id === id)
            );

            if (!allUserOrderIDsExist) {
                const result = await fetchDetailsForMissingUserOrderIDs(userOrderIDs);
                console.log(result)
                dispatch(setAPIData("cabbage"));

                dispatch(setAPIData(result));
                const newRows = flattenData(result);
                dispatch(setGridData([...rowData, ...newRows]));

                return [...rowData, ...newRows]; // Return the updated rowData
            }

            return rowData;
        } catch (error) {
            console.error(error);
        }
    };


    const fetchDetailsForMissingUserOrderIDs = async (userOrderIDs) => {
        const userOrderMeta = {
            product_id,
            user_order_ids: userOrderIDs,
            user_meta_keys: [
                'last_name',
                'stats_attendance_attended_cached',
                'skills-belaying',
                'first_name',
                'scores_attendance_reliability_score_cached',
                'scores_volunteer_reliability_score_cached',
                'scores_volunteer_value_cached',
                'stats_attendance_indoor_wednesday_attended_cached',
                'admin-can-you-help',
                'nickname',
                'climbing-indoors-leading-grades',
                'climbing-indoors-toproping-grades',
                'climbing-indoors-skills-passing-on',
                'admin-first-timer-indoor',
            ],
            order_meta_keys: ['cc_attendance', 'cc_volunteer', 'cc_volunteer_attendance'],
        };

        const postResponse = await fetch(`https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken,
            },
            body: JSON.stringify(userOrderMeta),
        });

        const result = await postResponse.json();
        //console.log(result); // Log the result
        return result;
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
    const [modalData, setModalData] = useState(null);

    const handleRowClick = (rowData) => {
        const selectedUserId = rowData.user_id;
        console.log(apiData); // Log the apiData
        console.log(selectedUserId); // Log the selectedUserId
        const selectedData = apiData[selectedUserId];
        console.log(selectedData); // Log the selectedData
        dispatch(setSelectedRow(rowData)); //becoming redundant?
        dispatch(setSelectedID(selectedUserId));
        setModalData(selectedData);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <div className="ag-theme-alpine" style={{ width: '100%', height: 500 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    rowSelection="multiple"
                />
            </div>
            <Modal open={isModalOpen} onClose={handleModalClose}>
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Modal Content
                    </Typography>
                    {modalData && (
                        <>
                            <Typography id="modal-modal-description">
                                First Name: {modalData.user_meta.first_name}
                            </Typography>
                            <Typography id="modal-modal-description">
                                Last Name: {modalData.user_meta.last_name}
                            </Typography>
                            <Typography id="modal-modal-description">
                                Cabbage: {modalData.user_meta.nickname}
                            </Typography>
                        </>
                    )}
                    <Button onClick={handleModalClose}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Data;
