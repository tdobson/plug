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
const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
const [columnDefs, setColumnDefs] = useState([
{ field: 'make', filter: true },
{ field: 'model', filter: true },
{ field: 'price' }
]);
const defaultColDef = useMemo(() => ({
sortable: true
}));

const cellClickedListener = useCallback(event => {
console.log('cellClicked', event);
}, []);

useEffect(() => {
fetch('https://www.ag-grid.com/example-assets/row-data.json')
.then(result => result.json())
.then(rowData => setRowData(rowData))
}, []);

const buttonListener = useCallback(e => {
gridRef.current.api.deselectAll();
}, []);

return (
<Router>
<Seo />
<main role="main" className="wrapper">
<div className="content">
<div>
<button onClick={buttonListener}>Push Me</button>
<div className="ag-theme-alpine" style={{ width: 500, height: 500 }}>
<AgGridReact
             ref={gridRef}
             rowData={rowData}
             columnDefs={columnDefs}
             defaultColDef={defaultColDef}
             animateRows={true}
             rowSelection='multiple'
             onCellClicked={cellClickedListener}
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