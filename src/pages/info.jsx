import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Data from '../components/data.jsx';
import { setSelectedRow } from '../components/actions.jsx';

export default function Info() {
    const dispatch = useDispatch();
    const selectedRow = useSelector((state) => state.selectedRow);

    const handleRowClick = (rowData) => {
        dispatch(setSelectedRow(rowData));
    };

    return (
        <>
            <h1 className="title">Info!</h1>
            <div>
                <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
                    <Data product_id={13915} handleRowClick={handleRowClick} />
                </div>
            </div>
        </>
    );
}
