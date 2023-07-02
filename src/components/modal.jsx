import React from 'react';
import { Button, Dialog, Slide, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalComponent = ({ isModalOpen, handleModalClose, handleCheckIn, selectedData }) => {
    const getSkillBackgroundColor = () => {
        if (!selectedData || !selectedData.user_meta || !selectedData.user_meta['skills-belaying']) {
            return ''; // Return empty string for default background color
        }

        const skillsBelaying = selectedData.user_meta['skills-belaying'];
        if (skillsBelaying === 'lead-belayer') {
            return 'palegreen';
        } else if (skillsBelaying === 'Top-rope-belaying') {
            return 'cyan';
        } else if (skillsBelaying === 'learner-lead-belayer') {
            return 'yellow';
        } else if (skillsBelaying === 'No-Belaying') {
            return 'red';
        }

        return ''; // Empty string for default background color
    };

    const getLastClimbedBackgroundColor = () => {
        if (
            !selectedData ||
            !selectedData.user_meta ||
            !selectedData.user_meta.cc_compliance_last_date_of_climbing
        ) {
            return ''; // Return empty string for default background color
        }

        const lastDateOfClimbing = new Date(selectedData.user_meta.cc_compliance_last_date_of_climbing);
        const today = new Date();
        const daysDifference = Math.floor((today - lastDateOfClimbing) / (1000 * 60 * 60 * 24));

        if (daysDifference > 60) {
            return 'lightblue'; // Return light blue for more than 60 days difference
        }

        return ''; // Empty string for default background color
    };

    const listItemStyle = {
        backgroundColor: getSkillBackgroundColor() || getLastClimbedBackgroundColor(),
    };

    return (
        <Dialog fullScreen open={isModalOpen} onClose={handleModalClose} TransitionComponent={Transition}>
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
                            <ListItemText
                                primary={selectedData.user_meta.first_name + ' ' + selectedData.user_meta.last_name}
                                secondary={'aka ' + selectedData.user_meta.nickname}
                            />
                        </ListItem>
                        {selectedData.order_meta.cc_volunteer !== 'none' && (
                            <>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="You know what you're doing to help with"
                                        secondary={selectedData.order_meta.cc_volunteer + ' this time?'}
                                    />
                                </ListItem>
                            </>
                        )}
                        {selectedData.user_meta.stats_attendance_indoor_wednesday_attended_cached == "0" && (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary="First time attendee"
                                            secondary={selectedData.user_meta.first_name + ' is here for the first time'}
                                        />
                                    </ListItem>
                                </>
                            )}
                        <Divider />
                        <ListItem style={listItemStyle}>
                            <ListItemText
                                primary="This is the colour wristband to give"
                                secondary={selectedData.user_meta['skills-belaying']}
                            />
                        </ListItem>
                        <Divider />
                        {getLastClimbedBackgroundColor() === 'lightblue' && (
                            <>
                                <ListItem style={listItemStyle}>
                                    <ListItemText
                                        primary="Good to have you back"
                                        secondary="It's been some time since you last climbed with us"
                                    />
                                </ListItem>
                            </>
                        )}
                        <Divider />
                        {/* Add more ListItems for other properties as needed */}
                    </>
                )}
            </List>
        </Dialog>
    );
};

export default ModalComponent;
