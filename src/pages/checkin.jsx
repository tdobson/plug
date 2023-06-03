import { useLocation } from 'wouter';
import React, { useContext } from 'react';
import { DataContext } from '../dataContext';

export default function CheckIn() {
  const { selectedRow } = useContext(DataContext); // Get the selectedRow from the data context

  return (
    <>
      <h1 className="title">CheckIn!</h1>
      <div>
        {/* Display the selected row's data */}
        {selectedRow && (
          <>
            <p>First Name: {selectedRow.first_name}</p>
            <p>Last Name: {selectedRow.last_name}</p>
            {/* ... other data fields ... */}
          </>
        )}
      </div>
    </>
  );
}