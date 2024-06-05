neoClan
=============

neoClan is a React-based checkin app providing functionality for attendance at sports events. It provides a dynamic table interface using Mantine a custom WordPress API which is attached.

Project Overview
----------------

neoClan showcases a modular and scalable structure, utilizing various libraries for UI components, state management, and testing. The application allows users to view, create, update, and delete solar PV install information through an intuitive table interface.

Key Dependencies
----------------

-   **React**: A JavaScript library for building user interfaces.
-   **Next.js**: A React framework for applications.
-   **Mantine**: A suite of React components and hooks for building user interfaces.
-   **Mantine React Table**: A powerful and customizable table component for React.
-   **React Query**: A library for managing and synchronizing server state in React applications.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Jest** and **Testing Library**: Tools for writing and running tests for React components.

Project Structure
-----------------

The project follows a modular and scalable structure, with the following main directories and files:

-   **`app/`**: Contains the Next.js app structure.
  -   **`checkin/`**: Contains the checkin page and related components.
    -   **`CheckInTableWrapper.tsx`**: A client component that wraps the CheckInTableWrapper and handles data fetching and mutations.
    -   **`page.tsx`**: The server component that renders the Checkins page.
  -   **`layout.tsx`**: Defines the root layout for the application.
  -   **`page.tsx`**: The main page of the application.
  -   **`QueryProvider.tsx`**: Provides the React Query client to the application.
-   **`components/`**: Contains reusable UI components for the application.
  -   **`ColorSchemeToggle/`**: Allows toggling between light and dark color schemes.
  -   **`ElevationDetails/`**: Displays detailed information about a selected elevation.
  -   **`ElevationTable/`**: Renders the table for managing checkins.
  -   **`Welcome/`**: Displays a welcome message on the main page.
-   **`hooks/`**: Contains custom React hooks.
  -   **`useCheckin.ts`**: A custom hook for managing checkin data using React Query.
-   **`services/`**: Contains API service functions for interacting with the Snowy API.
  -   **`checkinsService.ts`**: Provides functions for fetching, creating, updating, and deleting checkins.
-   **`types/`**: Contains TypeScript type definitions for the application's data models.
  -   **`elevation.ts`**: Defines the Checkin interface.
-   **`utils/`**: Contains utility functions and modules.
  -   **`api.ts`**: Defines the API request function and API service functions for interacting with the Snowy API.
-   **`theme.ts`**: Defines the Mantine theme configuration for the application.
-   **`next.config.mjs`**: Configuration file for Next.js.
-   **`postcss.config.cjs`**: Configuration file for PostCSS.
-   **`tsconfig.json`**: TypeScript configuration file.
-   **`jest.config.cjs`** and **`jest.setup.cjs`**: Configuration files for Jest testing framework.

Application Flow
----------------

1.  The user navigates to the Elevations page (`app/elevations/page.tsx`).
2.  The `ElevationTableWrapper` component (`app/elevations/ElevationTableWrapper.tsx`) fetches the elevations data from the Snowy API using the `useQuery` hook from React Query.
3.  The `ElevationTable` component (`components/ElevationTable/ElevationTable.tsx`) renders the table with the fetched elevations data.
4.  The user can perform CRUD operations on the elevations:
  -   Create: The user can click the "Create New Elevation" button to open a modal and fill in the details for a new elevation. The `createMutation` from `ElevationTableWrapper` sends a POST request to the Snowy API to create the new elevation.
  -   Read: The user can view the elevations in the table and click on a row to see more details in the `ElevationDetails` component (`components/ElevationDetails/ElevationDetails.tsx`).
  -   Update: The user can click the edit icon on a row to open a modal and update the elevation details. The `updateMutation` from `ElevationTableWrapper` sends a PUT request to the Snowy API to update the elevation.
  -   Delete: The user can click the delete icon on a row to delete an elevation. The `deleteMutation` from `ElevationTableWrapper` sends a DELETE request to the Snowy API to delete the elevation.
5.  The `useElevations` hook (`hooks/useElevations.ts`) provides the necessary data fetching and mutation functions for managing elevations data using React Query.
6.  The `elevationsService` (`services/elevationsService.ts`) acts as an intermediary between the application and the Snowy API, providing functions for fetching, creating, updating, and deleting elevations.
7.  The `api` utility module (`utils/api.ts`) handles the API requests and error handling, making use of the Mantine notifications system to display error messages.

Running the Project
-------------------

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Open the application in your browser at `http://localhost:3000`

Testing
-------

The project includes a testing setup using Jest and Testing Library. To run the tests, use the following command:

