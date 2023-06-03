import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Router, Link } from "wouter";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import PageRouter from "./components/router.jsx";
import Seo from './components/seo.jsx';
import "./styles/styles.css";

export default function Home() {


  return (
    <Router>
      <Seo />
      <main role="main" className="wrapper">
        <div className="content">
<h2> Welcome to matrix</h2>
          </div>
          <PageRouter />
      </main>
      <footer className="footer">
        <div className="links">
          <Link href="/">Home</Link>                    <span className="divider">|</span>

          <Link href="/about">About</Link>                    <span className="divider">|</span>

          <Link href="/Info">Info</Link>
                    <span className="divider">|</span>
          <Link href="/CheckIn">CheckIn</Link>
                    <span className="divider">|</span>

        </div>
      </footer>
    </Router>
  );
}
