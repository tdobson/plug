import React from 'react';
import Data from '../components/data.jsx';

export default function Info() {
    const product_id = 15275; // Define the product_id here

    return (
        <>
            <div >
                <Data product_id={product_id} />
            </div>
        </>
    );
}
