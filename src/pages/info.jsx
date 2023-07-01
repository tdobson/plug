import React from 'react';
import Data from '../components/data.jsx';

export default function Info() {
    const product_id = 13915; // Define the product_id here

    return (
        <>
            <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
                <Data product_id={product_id} />
            </div>
        </>
    );
}
