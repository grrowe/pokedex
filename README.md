# Pokedex Explorer

This is a Pokedex application that allows users to explore Pokemon data.

## Project Overview

This is a fun little Pokedex of the original 151 pokemon. You can search for your favorite, add to your favorites, and filter based on your preferred types of pokemon!

## Setup Instructions

You will have to perform the following on both /server and /client

```
npm install
npm run dev
```

once both environments are running please visit http://localhost:5173/ to view the web pokedex.

## Assumptions, Tradeoffs, and Notes

- I assumed the user would like a global list of pokemon and filter on type based on the requirements of the assement, however the API provided (https://pokeapi.co/api/v2/pokemon) only provides the name and link to the details of that pokemon.
    - So, I made a route (`app.get("/pokemon")`) on the express server to loop through the 151 pokemon and fetch the details then return in a large list of pokemon with details like type and stats etc.
    - In doing so the initial query is rather long, like 1 second during my review. This can be cut down if we lower the amount of pokemon we query, but still something to consider.

- I used Chakra UI for the component library, docs here: https://chakra-ui.com/

- This is more of an FYI, this was my first time using react context and hooks to retrieve data. Once I understood it, it is incredible...

## Future Improvements

If I had more time, I would like to improve the styling and make some query optimizations.
Improvements in the future:
- Styling, to look more pokedex like
- Some query optimizations, specifically the first big query
- The search function, it is working but it would does not filter the list but instead just queries once it the debounce is finished.
- Finally, I dont store the state of pagination. For example, if you go to page 6, select a pokemon and return to the list, it will return to page 1.

---

**Note to developer:** This README is part of your interview assessment. Please update the sections above with relevant information about your implementation.
