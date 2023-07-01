export const setSelectedRow = (row) => ({
    type: 'SET_SELECTED_ROW',
    payload: row,
});

export const setGridData = (data) => ({
    type: 'SET_GRID_DATA',
    payload: data,
});

export const setEventID = (event_id) => ({
    type: 'SET_EVENT_ID',
    payload: event_id,
});

export const setAPIData = (data) => ({
    type: 'SET_API_DATA',
    payload: data,
});

export const setSelectedID = (selectedUserId) => ({
    type: 'SET_SELECTED_ID',
    payload: selectedUserId,
});
