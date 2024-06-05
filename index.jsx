import React from 'react';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Data } from '../components/Data/Data';

export default function HomePage() {
    return (
        <>
            <Welcome />
            <ColorSchemeToggle />
            <Data product_id={14426} />
        </>
    );
}
