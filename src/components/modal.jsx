import React from 'react';
import { Button, Dialog, Slide, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalComponent = ({ isModalOpen, handleModalClose, handleCheckIn, selectedData }) => {
    return (
        <Dialog
            fullScreen
            open={isModalOpen}
            onClose={handleModalClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleModalClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Check In
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleCheckIn}>
                        Check In
                    </Button>
                </Toolbar>
            </AppBar>
            <List>
                {selectedData && (
                    <>
                        <ListItem>
                            <ListItemText primary="First Name" secondary={selectedData.user_meta.first_name} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Last Name" secondary={selectedData.user_meta.last_name} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Facebook Name" secondary={selectedData.user_meta.nickname} />
                        </ListItem>
                        {selectedData.order_meta.cc_volunteer != "none" && ( <>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Stats: Attendance Attended Cached" secondary={selectedData.order_meta.cc_volunteer} />
                        </ListItem> </>)}
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Skills: Belaying" secondary={selectedData.user_meta['skills-belaying']} />
                        </ListItem>
                        <Divider />
                        {/* Add more ListItems for other properties as needed */}
                    </>
                )}
            </List>
        </Dialog>
    );
};

export default ModalComponent;
