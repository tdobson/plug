import { createStore } from 'redux';

// Define initial state
const initialState = {
    selectedRow: null,
    gridData: [],
    apiData: {},
    eventID: 0,
    selectedID: 0
};

// Define reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SELECTED_ROW':
            return {
                ...state,
                selectedRow: action.payload,
            };
        case 'SET_GRID_DATA':
            return {
                ...state,
                gridData: action.payload,
            };
        case 'SET_API_DATA':
           // console.log('SET_API_DATA action dispatched:', action.payload);
            return {
                ...state,
                apiData: action.payload,
            };
        case 'SET_SELECTED_ID':
            return {
                ...state,
                selectedID: action.payload,
            };
        case 'SET_EVENT_ID':
            return {
                ...state,
                eventID: action.payload,
            };
        default:
            return state;
    }

};

// Create Redux store
const store = createStore(reducer);

export default store;
