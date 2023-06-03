import React, { useState, useCallback, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import CheckIn from '../pages/checkin';
import { DataContext } from '../dataContext';
import Data from '../components/data.jsx';


export default function Info() {
  const { setSelectedRow } = useContext(DataContext); // Get the setSelectedRow function from the data context

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData); // Update the selected row in the data context
  };

  return (
    <>
      <h1 className="title">Info!</h1>
      <div>
        <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
          <Data product_id={13915} handleRowClick={handleRowClick} />
        </div>
      </div>

      <Link href="/checkin">
        <button>Check In</button>
      </Link>
    </>
  );
}