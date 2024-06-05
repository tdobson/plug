import React from 'react';
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { QueryProvider } from './QueryProvider';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Component {...pageProps} />
            </MantineProvider>
        </QueryProvider>
    );
}
