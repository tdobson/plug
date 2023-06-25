import React from 'react';
import { Switch, Route } from 'wouter';
import Home from '../pages/home';
import About from '../pages/about';
import Info from '../pages/info';
import CheckIn from '../pages/checkin';

export default function PageRouter() {
    return (
        <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/info" component={Info} />
            <Route path="/checkin" component={CheckIn} />
        </Switch>
    );
}
