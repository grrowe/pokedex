# Pokedex Explorer

This is a Pokedex application that allows users to explore Pokemon data.

## Project Overview

This is a fun little Pokedex of the original 151 pokemon. You can search for your favorite, add to your favorites, and filter based on your preferred types of pokemon!

https://github.com/user-attachments/assets/a496221c-7112-4fdc-ab26-9f4332e51149

## Setup Instructions

You will have to perform the following on both /server and /client

```
npm install
npm run dev
```
Once both environments are running please visit http://localhost:5173/ to view the web pokedex.

## Future Improvements

If I had more time, I would like to improve the styling and make some query optimizations.
Improvements in the future:
- Some query optimizations, specifically the first big query
- Finally, client error handling. The most obvious example is the search bar, if you search for a pokemon that doesnt exist or like `pika` it wont search but on the backend it returns a 404 but is not shown to the user.
---
