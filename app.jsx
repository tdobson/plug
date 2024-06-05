import React from 'react';
import { Router, Link } from 'wouter';
import PageRouter from './components/router.jsx';
import Seo from './components/seo.jsx';
import './styles/styles.css';
import { Provider } from 'react-redux';
import store from './components/dataContext';

export default function App() {
    return (
        <Router>
            <Seo />
            <Provider store={store}>
                <main role="main" className="wrapper">
                    <div className="content">
                        <h2>Welcome to matrix</h2>
                    </div>
                    <PageRouter />
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
