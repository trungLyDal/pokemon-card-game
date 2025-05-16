const axios = require('axios');
const fs = require('fs').promises;

async function fetchAllPokemonCards() {
  const allCards = [];
  let currentPage = 1;
  const pageSize = 100;
  let fetching = true;

  const apiKey = process.env.REACT_APP_POKEMON_TCG_API_KEY;
  const headers = apiKey ? { 'X-Api-Key': apiKey } : {};

  try {
    while (fetching) {
      console.log(`Fetching page ${currentPage}...`);
      try {
        const response = await axios.get(
          `https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${currentPage}`,
          { headers }
        );

        if (response.data && response.data.data && response.data.data.length > 0) {
          allCards.push(...response.data.data);
          currentPage++;
          await new Promise(resolve => setTimeout(resolve, 150)); 
        } else {
          console.log('No more cards found or empty data. Stopping.');
          fetching = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error.message);
        fetching = false; // Stop fetching on error
      }

      if (allCards.length > 10000) { 
        console.warn('Fetched a large number of cards. Stopping as a precaution.');
        fetching = false;
      }
    }

    const dataDirectory = './src/data';
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(`${dataDirectory}/all_pokemon_cards.json`, JSON.stringify(allCards, null, 2), 'utf8');
    console.log(`Successfully fetched and saved ${allCards.length} cards to src/data/all_pokemon_cards.json`);

  } catch (error) {
    console.error('Error during the fetching process:', error);
  }
}

fetchAllPokemonCards();