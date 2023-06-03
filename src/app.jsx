import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Router, Link } from "wouter";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import PageRouter from "./components/router.jsx";
import Seo from './components/seo.jsx';
import "./styles/styles.css";
import { DataProvider } from './dataContext'; // Import the DataProvider

export default function Home() {


  return (
 <DataProvider> {/* Wrap your application with the DataProvider */}
      <Router>
        <Seo />
        <main role="main" className="wrapper">
          <div className="content">
            <h2>Welcome to matrix</h2>
          </div>
          <PageRouter />
        </main>
        <footer className="footer">
          <div className="links">
            <Link href="/">Home</Link>
            <span className="divider">|</span>
            <Link href="/about">About</Link>
            <span className="divider">|</span>
            <Link href="/info">Info</Link>
            <span className="divider">|</span>
            <Link href="/checkin">CheckIn</Link>
            <span className="divider">|</span>
          </div>
        </footer>
      </Router>
    </DataProvider>
  );
}
