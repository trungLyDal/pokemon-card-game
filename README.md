# Digital Pokémon Card Collection - [https://pokemontcgcollection.netlify.app/](https://pokemontcgcollection.netlify.app/)

A web application for managing and experiencing a digital Pokémon Trading Card Game collection. This project allows users to simulate opening booster packs, view their collected cards in a gallery, and see detailed information for each card.

---

## Features

- **Card Pack Openings:** Simulate the excitement of opening a Pokémon booster pack with animation and randomly selected cards.
- **Card Collection Gallery:** Browse your unique collection in a visually appealing grid layout.
- **Filtering:** Filter your collection by card name, type, rarity, or set.
- **Card Details:** Click any card to view comprehensive info, including market prices.
- **Animated Footer:** Stylish animated bubbles and quick links/socials.
- **Contact & Social:** Footer links for GitHub, LinkedIn, and email.
- **Persistent Storage:** Your collection is stored in MongoDB via a Node/Express backend.

---

## Technologies Used

- **Frontend:** React, react-icons, CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **API:** Pokémon TCG API
- **Deployment:** Netlify (frontend), Render (backend)
- **Other:** Environment variables for local/prod switching

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pokemon-card-collection.git
cd pokemon-card-collection
```
*(Replace with your actual repo URL.)*

### 2. Set up environment variables

#### **Frontend (`.env.local` in project root):**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_POKEMON_TCG_API_KEY=your-pokemon-tcg-api-key
```

#### **Backend (`server/.env`):**
```
MONGO_URI=your-mongodb-uri
PORT=5000
```

### 3. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 4. Run locally

- **Start backend:**  
  ```bash
  cd server
  npm start
  ```
- **Start frontend (in another terminal):**  
  ```bash
  npm start
  ```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Deployment

- **Frontend:** Deploy to [Netlify](https://netlify.com).  
  Set `REACT_APP_API_URL` in Netlify environment variables to your Render backend URL.
- **Backend:** Deploy to [Render](https://render.com).  
  Set `MONGO_URI` in Render environment variables.

---

## Project Structure

```
pokemon-card-collection/
├── src/
│   ├── assets/images/
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Layout.css
│   │   ├── CardGallery.js
│   │   ├── PackOpening.js
│   │   └── ...
│   ├── hooks/
│   │   └── useCollection.js
│   └── ...
├── server/
│   ├── server.js
│   ├── .env
│   └── routes/
│       ├── userCollection.js
│       └── cards.js
├── .env.local
├── package.json
├── README.md
└── .gitignore
```

---

## Customization

- **Footer:**  
  - Social/contact links and Pokéball image are in `src/components/Layout.js` and `src/assets/images/pokeball.png`.
- **Card Data:**  
  - Uses Pokémon TCG API and your own backend for collection management.

---

## Credits

- Pokémon TCG API
- Pokéball image © Pokémon/Nintendo
- Animated footer inspired by [codepen.io/z-](https://codepen.io/z-)

---

## License

MIT
