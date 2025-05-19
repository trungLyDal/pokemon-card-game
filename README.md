# Digital Pokémon Card Collection - https://pokemontcgcollection.netlify.app/

A web application for managing and experiencing a digital Pokémon Trading Card Game collection. This project allows users to simulate opening booster packs, view their collected cards in a gallery, and see detailed information for each card.

## Features

* **Card Pack Openings:** Simulate the excitement of opening a Pokémon booster pack with a visual animation and randomly selected cards from the Pokémon TCG API.
* **Card Collection Gallery:** Browse your entire collection in a visually appealing grid layout.
* **Filtering:** Easily filter your collection by card name, type, rarity, or set to quickly find the cards you're looking for.
* **Card Details:** Click on any card in your gallery to view comprehensive information, including its type, rarity, attacks, weaknesses, HP, and more.
* **Local Storage:** Your collection is currently stored locally in your browser's `localStorage`, allowing you to manage your cards without needing a backend.

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Axios:** A promise-based HTTP client for making API requests to fetch Pokémon card data.
* **Pokémon TCG API (pokemontcg.io):** A free API providing data for Pokémon trading cards.
* **CSS:** For styling the application and creating animations.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/pokemon-card-collection.git](https://github.com/your-username/pokemon-card-collection.git)
    cd pokemon-card-collection
    ```

    *(Replace `https://github.com/your-username/pokemon-card-collection.git` with the actual URL of your repository.)*

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm start
    ```

    This will run the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure
**Explanation of Key Directories and Files:**

- **`public/`:** Contains static assets served directly by the web server, including the main HTML file.
- **`src/`:** Holds the main source code of the React application.
    - **`App.js`:** The root component of the application.
    - **`App.css`:** Global styles for the application.
    - **`index.js`:** The entry point that renders the `App` component into the DOM.
    - **`components/`:** Houses reusable UI components:
        - `CardGallery`: Displays a grid or list of Pokémon cards.
        - `CardDetails`: Shows detailed information for a selected card.
        - `PackOpening`: Implements the virtual pack opening functionality.
        - `LoadingSpinner`: A visual indicator for loading states.
    - **`hooks/`:** Contains custom React hooks:
        - `useCollection.js`: Manages the logic and state related to fetching and handling the Pokémon card collection data.
- **`assets/`:** Stores static assets used by the application.
    - **`fonts/`:** Contains custom font files, such as `Pokemon Hollow.ttf`.
    - **`images/`:** Holds image assets, like `binderBackground.jpg`.
- **`package.json`:** Contains metadata about the project, including dependencies and scripts.
- **`package-lock.json`:** Records the exact versions of dependencies used in the project.
- **`README.md`:** This file, providing an overview and instructions for the project.
- **`.gitignore`:** Specifies files and directories that should be ignored by Git.
