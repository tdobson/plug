# Plug

plug is a React-based check-in app for villa bookings. It provides a dynamic table interface using Mantine, a suite of React components and hooks for building user interfaces. It relies on an API called Gnasher (or it can use its mock API baby called Gnipper)

## Project Overview

plug showcases a modular and scalable structure, utilizing various libraries for UI components, state management, and testing. The application allows users to view, create, update, and delete check-in information for sports events through an intuitive table interface.

## Key Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for applications.
- **Mantine**: A suite of React components and hooks for building user interfaces.
- **Mantine React Table**: A powerful and customizable table component for React.
- **React Query**: A library for managing and synchronizing server state in React applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Jest and Testing Library**: Tools for writing and running tests for React components.

## Project Structure

The project follows a modular and scalable structure, with the following main directories and files:

- **app/**: Contains the Next.js app structure.
    - **bookings/**: Contains the booking page and related components.
        - **page.tsx**: The main check-in page component.
    - **villas/**: Contains the villa list and related components.
        - **page.tsx**: The main pairing page component.
    - **customers/**: Contains the customer list and related components.
        - **page.tsx**: The main outdoor events page component.
    - **overnight-events/**: Contains the overnight events page and related components.
        - **page.tsx**: The main overnight events page component.
    - **training-events/**: Contains the training events page and related components.
        - **page.tsx**: The main training events page component.
    - **social-events/**: Contains the social events page and related components.
        - **page.tsx**: The main social events page component.
    - **layout.tsx**: Defines the root layout for the application.
    - **page.tsx**: The main page of the application.
- **components/**: Contains reusable UI components for the application.
    - **Modal/**: Contains the create new booking modal component for user interactions.
        - **Modal.tsx**: Handles displaying a modal for user interactions.
    - **Grid/**: Contains the grid layout component for displaying user data.
        - **Grid.tsx**: Renders a grid layout for user data.
    - **Common/**: Contains common reusable components.
- **hooks/**: Contains custom React hooks.
    - **useBookings.ts**: A custom hook for managing check-in data using React Query.
    - **useVilla.ts**: A custom hook for managing pairing data using React Query.
    - **useCustomer.ts**: A custom hook for managing events data using React Query.
- **services/**: Contains API service functions for interacting with the custom WordPress API.
    - **apiService.ts**: Provides functions for fetching, creating, updating, and deleting data.
- **types/**: Contains TypeScript type definitions for the application's data models.
    - **api.ts**: Defines the Checkin interface.
    - **events.ts**: Defines the Events interface.
- **utils/**: Contains utility functions and modules.
    - **api.ts**: Defines the API request function and API service functions for interacting with the custom WordPress API.
    - **helpers.ts**: Contains helper functions.
- **theme.ts**: Defines the Mantine theme configuration for the application.
- **next.config.mjs**: Configuration file for Next.js.
- **postcss.config.cjs**: Configuration file for PostCSS.
- **tsconfig.json**: TypeScript configuration file.
- **jest.config.cjs** and **jest.setup.cjs**: Configuration files for Jest testing framework.
- **seo.json**: Configuration file for SEO metadata.


## Running the Project

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open the application in your browser at [http://localhost:3000](http://localhost:3000)

## Testing

The project includes a testing setup using Jest and Testing Library. To run the tests, use the following command:

```bash
npm test
