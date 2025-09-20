# Telegram Web App - Vite + Vue Boilerplate

A production-ready boilerplate for building Telegram Web Apps with Vue 3, Vite, and Pinia. This template features a robust, decoupled architecture designed for clarity and scalability, with a focus on visual error reporting suitable for the Telegram environment.

## Key Features

- **Visual Error Reporting**: A dedicated error page (`/error`) displays detailed error information, eliminating the need for `console.log` in the production Telegram environment.
- **Clean Architecture**: Decoupled services for API and Telegram SDK interaction.
- **Centralized State Management**: A single Pinia store (`telegram.js`) orchestrates the entire application state and initialization logic.
- **Robust Authentication Flow**: A clear, sequential process for authenticating users from app launch to API access.
- **Guard-Protected Routing**: Vue Router's navigation guard ensures the app is fully initialized before displaying content.

## Visual Error Handling Strategy

Since `console.log` is inaccessible inside the Telegram mobile app, this boilerplate adopts a visual error handling strategy.

- **No `console.log` for Critical Info**: The application avoids relying on console output for debugging critical flows.
- **Dedicated Error Page**: Any failure during the critical initialization sequence (SDK loading, API calls) will automatically redirect the user to the `/error` page.
- **Detailed Diagnostics**: This page renders the error message and stack trace directly on the screen, allowing users to screenshot and report the exact problem.
- **Easy Retry**: A "Retry" button on the error page allows the user to restart the initialization flow from a clean state.

## Authentication & Initialization Flow

1.  **App Load & Navigation**: A user opens the app, and Vue Router attempts to navigate to the initial route.
2.  **Router Guard Trigger**: The `beforeEach` guard in `src/router/index.js` intercepts the navigation.
3.  **Store Initialization**: The guard calls the `initialize()` action in `telegramStore`. This action performs the following sequence:
    a. Load Telegram SDK.
    b. Retrieve `initData`.
    c. Authenticate with the backend via API call.
    d. Store the returned JWT.
4.  **UI Rendering**:
    - **On Failure**: If any step in the sequence fails, the `catch` block in the store redirects the user to the `/error` page. The error details are passed as query parameters.
    - **On Success**: The user is allowed to proceed, and `App.vue` renders the requested page via `<router-view>`.

## Core Architecture Files

-   `src/stores/telegram.js`: **The brain of the application.** Manages state and orchestrates the initialization sequence. On failure, it is responsible for redirecting to the error page.
-   `src/pages/error.vue`: **The diagnostic screen.** A self-contained page that renders error details passed to it via URL query parameters.
-   `src/router/index.js`: **The gatekeeper.** Triggers the initialization sequence and contains the route for the error page.
-   `src/App.vue`: **The shell.** A minimal root component that shows a loading screen or the `<router-view>`. It no longer contains any error display logic itself.
-   `src/services/telegramService.js` & `src/services/apiService.js`: Dedicated services for external interactions.

## Architecture Overview

```mermaid
graph TD
    A[User Enters App] --> B(Router Guard);
    B -- triggers --> C{telegramStore.initialize()};
    
    subgraph "Initialization Flow"
        C --> D[1. Load SDK];
        D --> E[2. Get initData];
        E --> F[3. POST to Backend];
        F --> G[4. Store JWT];
    end

    C -- On Failure --> H(Redirect to /error);
    H --> I[error.vue displays error details];
    G -- On Success --> J[App.vue shows Protected Content];
```

## Getting Started

1.  Set up environment variables: `cp .env.example .env`
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
