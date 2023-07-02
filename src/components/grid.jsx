import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@mui/material';

const GridComponent = ({ rowData, columnDefs, defaultColDef, handleRowClick }) => {
    const gridStyle = {
        width: '100%',
        height: '90vh', // Set the height to 100vh for full screen
    };

    return (
        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                rowSelection="multiple"
                onRowClicked={(event) => handleRowClick(event.data)}
            />
        </div>
    );
};

export default GridComponent;
