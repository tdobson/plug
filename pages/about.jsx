import React from 'react';
import { Text, List, ListItem } from '@mantine/core';

export default function About() {
    return (
        <div>
            <Text component="h1" className="title">
                About this abc
            </Text>
            <Text>
                Welcome to the Glitch React starter, where you can instantly create a React site that's fully customizable.
            </Text>
            {/* ... (rest of the component code) */}
        </div>
    );
}
