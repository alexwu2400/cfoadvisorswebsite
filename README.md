# CFO Advisors - Local Website Recreation

This project is a local recreation of the CFO Advisors Webflow website ([cfoadvisors-248196d6728cfb467fea544aaab.webflow.io](https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/)) for development and testing purposes.

## Objective

Gain a deep understanding of the current Webflow site structure and components using available MCP tools to recreate a functional representation locally. This facilitates more dynamic and efficient development, testing, and potential future enhancements.

## Getting Started

1.  **Clone the repository (if applicable)**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev:vite
    ```
    This will start a local development server (usually at http://localhost:5173) with hot module replacement.

## Available Scripts

-   `npm run dev:vite`: Starts the Vite development server.
-   `npm run build`: Builds the project for production.
-   `npm run preview`: Serves the production build locally for preview.
-   `npm run lint`: Lints the project files using ESLint.
-   `npm run format`: Formats the project files using Prettier.

## Project Structure

-   `index.html`: Main HTML entry point (in project root).
-   `src/`: Contains the source code.
    -   `main.js`: Main JavaScript entry point.
    -   `styles/`: CSS files.
        -   `main.css`: Main stylesheet.
    -   `assets/`: Static assets like images, fonts.
-   `public/`: Static assets that are directly copied to the build output (not processed by Vite).
-   `vite.config.js`: Vite configuration file (if needed).
-   `.eslintrc.json`: ESLint configuration.
-   `.prettierrc.json`: Prettier configuration.
-   `tasks/`: Contains task definitions managed by `task-master`.

## Next Steps (Based on PRD)

1.  Analyze Homepage Structure Using MCP Webflow Tools (Task 2)
2.  Extract and Document Homepage Styling (Task 3)
3.  Implement Basic HTML Structure for Homepage (Task 4)