neoClan

neoClan is a React-based check-in app for sports events. It provides a dynamic table interface using Mantine, a suite of React components and hooks for building user interfaces, and a custom WordPress API.
Project Overview

neoClan showcases a modular and scalable structure, utilizing various libraries for UI components, state management, and testing. The application allows users to view, create, update, and delete check-in information for sports events through an intuitive table interface.
Key Dependencies

    React: A JavaScript library for building user interfaces.
    Next.js: A React framework for applications.
    Mantine: A suite of React components and hooks for building user interfaces.
    Mantine React Table: A powerful and customizable table component for React.
    React Query: A library for managing and synchronizing server state in React applications.
    TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
    Jest and Testing Library: Tools for writing and running tests for React components.

Project Structure

The project follows a modular and scalable structure, with the following main directories and files:

    app/: Contains the Next.js app structure.
        checkin/: Contains the check-in page and related components.
            CheckInTableWrapper.tsx: A client component that wraps the CheckInTable and handles data fetching and mutations.
            page.tsx: The server component that renders the Check-ins page.
        layout.tsx: Defines the root layout for the application.
        page.tsx: The main page of the application.
        QueryProvider.tsx: Provides the React Query client to the application.
    components/: Contains reusable UI components for the application.
        ColorSchemeToggle/: Allows toggling between light and dark color schemes.
        CheckInDetails/: Displays detailed information about a selected check-in.
        CheckInTable/: Renders the table for managing check-ins.
        Welcome/: Displays a welcome message on the main page.
    hooks/: Contains custom React hooks.
        useCheckin.ts: A custom hook for managing check-in data using React Query.
    services/: Contains API service functions for interacting with the custom WordPress API.
        checkinsService.ts: Provides functions for fetching, creating, updating, and deleting check-ins.
    types/: Contains TypeScript type definitions for the application's data models.
        checkin.ts: Defines the Checkin interface.
    utils/: Contains utility functions and modules.
        api.ts: Defines the API request function and API service functions for interacting with the custom WordPress API.
    theme.ts: Defines the Mantine theme configuration for the application.
    next.config.mjs: Configuration file for Next.js.
    postcss.config.cjs: Configuration file for PostCSS.
    tsconfig.json: TypeScript configuration file.
    jest.config.cjs and jest.setup.cjs: Configuration files for Jest testing framework.

Application Flow

    The user navigates to the Check-ins page (app/checkin/page.tsx).
    The CheckInTableWrapper component (app/checkin/CheckInTableWrapper.tsx) fetches the check-in data from the custom WordPress API using the useQuery hook from React Query.
    The CheckInTable component (components/CheckInTable/CheckInTable.tsx) renders the table with the fetched check-in data.
    The user can perform CRUD operations on the check-ins:
        Create: The user can click the "Create New Check-in" button to open a modal and fill in the details for a new check-in. The createMutation from CheckInTableWrapper sends a POST request to the custom WordPress API to create the new check-in.
        Read: The user can view the check-ins in the table and click on a row to see more details in the CheckInDetails component (components/CheckInDetails/CheckInDetails.tsx).
        Update: The user can click the edit icon on a row to open a modal and update the check-in details. The updateMutation from CheckInTableWrapper sends a PUT request to the custom WordPress API to update the check-in.
        Delete: The user can click the delete icon on a row to delete a check-in. The deleteMutation from CheckInTableWrapper sends a DELETE request to the custom WordPress API to delete the check-in.
    The useCheckins hook (hooks/useCheckins.ts) provides the necessary data fetching and mutation functions for managing check-in data using React Query.
    The checkinsService (services/checkinsService.ts) acts as an intermediary between the application and the custom WordPress API, providing functions for fetching, creating, updating, and deleting check-ins.
    The api utility module (utils/api.ts) handles the API requests and error handling, making use of the Mantine notifications system to display error messages.

Running the Project

    Install dependencies: npm install
    Start the development server: npm run dev
    Open the application in your browser at http://localhost:3000

Testing

The project includes a testing setup using Jest and Testing Library. To run the tests, use the following command:

npm test
