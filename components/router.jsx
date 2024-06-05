import React from 'react';
import { Switch, Route } from 'wouter';
import About from '../pages/about';
import Info from '../pages/info';
import CheckIn from '../pages/checkin';

export default function PageRouter() {
    return (
        <Switch>
            <Route path="/" component={Info} />
            <Route path="/about" component={About} />
            <Route path="/checkin" component={CheckIn} />
        </Switch>
    );
}
