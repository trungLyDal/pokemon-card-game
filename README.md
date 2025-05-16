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
