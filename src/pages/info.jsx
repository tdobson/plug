import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import CheckIn from '../pages/checkin';
import Data from "../components/data.jsx";

export default function Info() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [, navigate] = useLocation();

  const handleRowClick = useCallback(rowData => {
    setSelectedRow(rowData);
    navigate('/checkin');
  }, [navigate]);

  return (
    <>
      <h1 className="title">Info!</h1>
      <div>
        <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
          <Data product_id={13915} handleRowClick={handleRowClick} />
        </div>
      </div>

      {selectedRow && (
        <Link href="/checkin">
          <CheckIn rowData={selectedRow} />
        </Link>
      )}
    </>
  );
}
