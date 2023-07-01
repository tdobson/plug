import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const ModalComponent = ({ isModalOpen, handleModalClose, handleCheckIn, selectedData }) => {
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
        <Modal open={isModalOpen} onClose={handleModalClose}>
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Check In
                </Typography>
                {selectedData && (
                    <>
                        <Typography id="modal-modal-description">
                            First Name: {selectedData.user_meta.first_name}
                        </Typography>
                        <Typography id="modal-modal-description">
                            Last Name: {selectedData.user_meta.last_name}
                        </Typography>
                        <Typography id="modal-modal-description">
                            Cabbage: {selectedData.user_meta.nickname}
                        </Typography>
                        <Button onClick={handleCheckIn}>Check In</Button>
                        <Button onClick={handleModalClose}>Close & don't check in</Button>
                    </>
                )}
                <Button onClick={handleModalClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
