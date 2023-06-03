import React, { createContext, useState } from 'react';

// Create a data context
export const DataContext = createContext();

// Data context provider
export const DataProvider = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <DataContext.Provider value={{ selectedRow, setSelectedRow }}>
      {children}
    </DataContext.Provider>
  );
};
