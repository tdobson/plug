import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Router, Link } from "wouter";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PageRouter from "./components/router.jsx";
import Seo from './components/seo.jsx';
import "./styles/styles.css";
import store from './dataContext';
import { Provider } from 'react-redux';

export default function Home() {
  return (
      <Router>
          <Seo />

          <Provider store={store}>
              <main role="main" className="wrapper">
          <div className="content">
            <h2> Welcome to matrix</h2>
          </div>
          <PageRouter /> {/* Render the PageRouter component */}
        </main>
      </Provider>

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
  );
}
