# Pokedex Explorer

This is a Pokedex application that allows users to explore Pokemon data.

## Project Overview

This is a fun little Pokedex of the original 151 pokemon. You can search for your favorite, add to your favorites, and filter based on your preferred types of pokemon!



## Setup Instructions

You will have to perform the following on both /server and /client

```
npm install

add a .env file at the root of `server` with 
AUTH_PORT=5001
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN  -- use openssl rand -base64 32 to generate tokens
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN

add a .env file at the root of `client` with
VITE_AUTH_URL=http://localhost:5001
VITE_BASE_URL=http://localhost:5000

npm run dev
```
Once both environments are running please visit http://localhost:5173/ to view the web pokedex.

## Future Improvements

If I had more time, I would like to improve the styling and make some query optimizations.
Improvements in the future:
- Some query optimizations, specifically the first big query
- Finally, client error handling. The most obvious example is the search bar, if you search for a pokemon that doesnt exist or like `pika` it wont search but on the backend it returns a 404 but is not shown to the user.
---
