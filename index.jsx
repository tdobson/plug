import React from "react";
import { createRoot } from 'react-dom/client';

import App from "./app.jsx";
import { HelmetProvider } from 'react-helmet-async';
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev";

/**
 * Root of react site
 *
 * Imports Helmet provider for the page head
 * And App which defines the content and navigation
 */

// Render the site https://reactjs.org/docs/react-dom.html#render

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
                <App />
            </DevSupport>
        </HelmetProvider>
    </React.StrictMode>
);
