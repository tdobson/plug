import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedRow, setAPIData, setGridData } from '../components/actions.jsx';
import Data from '../components/data.jsx';
import { Button, Modal } from '@mui/material';

export default function Info() {
    const dispatch = useDispatch();
    const selectedRow = useSelector((state) => state.selectedRow);


    return (
        <>

            <div>
                <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
                    <Data product_id={13915}  />
                </div>
            </div>

        </>
    );
}
