import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedRow,setAPIData,setGridData } from '../components/actions.jsx';
import Data from '../components/data.jsx';
import { Modal } from '@mui/material';
import { useState } from 'react';


export default function CheckIn() {
    const selectedRow = useSelector((state) => state.selectedRow);

    const [isModalOpen, setIsModalOpen] = useState(false); // Add this line


    const handleModalOpen = () => {
        setIsModalOpen(true);
    };


    return (
        <>
            <h1 className="title">CheckIn!</h1>
            <div>
                {selectedRow && (
                    <>
                        <p>First Name: {selectedRow.first_name}</p>
                        <p>Last Name: {selectedRow.last_name}</p>
                        <p>Cabbage: {selectedRow.nickname}</p>
                    </>
                )}
            </div>
        </>
    );
}
