import React from "react";
import { useLocation } from 'wouter';

export default function CheckIn({ rowData }) {
  return (
    <>
      <h1 className="title">CheckIn!</h1>
      <div>
        {/* Display the selected row's data */}
        <p>First Name: {rowData.first_name}</p>
        <p>Last Name: {rowData.last_name}</p>
        {/* ... other data fields ... */}
      </div>
    </>
  );
}

