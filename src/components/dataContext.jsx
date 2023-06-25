import { createStore } from 'redux';

// Define initial state
const initialState = {
    selectedRow: null,
    gridData: [],
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
        default:
            return state;
    }
};

// Create Redux store
const store = createStore(reducer);

export default store;
