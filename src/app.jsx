import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Router, Link } from "wouter";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import PageRouter from "./components/router.jsx";
import Seo from './components/seo.jsx';
import "./styles/styles.css";

export default function Home() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'user_id', headerName: 'User ID' },
    { field: 'nickname', headerName: 'Nickname' },
    { field: 'stats_attendance_attended_cached', headerName: 'Attended' },
    { field: 'skills-belaying', headerName: 'Skills Belaying' },
    { field: 'first_name', headerName: 'First Name' },
    { field: 'cc_attendance', headerName: 'CC Attendance' },
    { field: 'cc_volunteer', headerName: 'CC Volunteer' },
    { field: 'cc_volunteer_attendance', headerName: 'CC Volunteer Attendance' },
  ]);

  const product_id = 13915;

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  const fetchData = async () => {
    try {
      const response = await fetch(`https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${product_id}`);
      const userOrderIDs = await response.json();

      const userOrderMeta = {
        product_id,
        user_order_ids: userOrderIDs,
        user_meta_keys: ["nickname", "stats_attendance_attended_cached", "skills-belaying", "first_name"],
        order_meta_keys: ["cc_attendance", "cc_volunteer", "cc_volunteer_attendance"],
      };

      const postResponse = await fetch(`https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userOrderMeta),
      });

      const result = await postResponse.json();
      const flattenedData = Object.entries(result).map(([user_id, data]) => {
        return {
          user_id,
          ...data.user_meta,
          ...data.order_meta,
        };
      });
      setRowData(flattenedData);
    } catch (error) {
      console.error(error);
    }
  };

  const buttonListener = useCallback(() => {
    gridRef.current.api.deselectAll();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Router>
      <Seo />
      <main role="main" className="wrapper">
        <div className="content">
          <div>
            <button onClick={buttonListener}>Fetch Data</button>
            <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                rowSelection='multiple'
              />
            </div>
          </div>
          <PageRouter />
        </div>
      </main>
      <footer className="footer">
        <div className="links">
          <Link href="/">Home</Link>
          <span className="divider">|</span>
          <Link href="/about">About</Link>
        </div>
      </footer>
    </Router>
  );
}
