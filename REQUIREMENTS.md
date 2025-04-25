# Pokédex Explorer

## Objective

Your task is to build a Pokédex explorer. Users should be allowed to
browse, search, and view details of Pokémon using data from the
[PokéAPI](https://pokeapi.co). You are free to use tools
and libraries you are comfortable with, however, you must use the
following technologies:

- React (frontend)

- Express (backend)

- Typescript (everywhere)

## Features & Requirements

### Frontend (React + TypeScript)

1.  Search & Browse

    a.  Provide a list or grid of Pokémon displaying their name and
        image.

    b.  Support searching by name

    c.  Optional: Implement pagination or infinite scrolling

2.  Detail View

    a.  When selecting a Pokémon, show details including:

        i.  Types

        ii. Abilities

        iii. Base stats (HP, attack damage, defense, etc.)

        iv. Image

    b.  Display the data in a visually clear and organized way

3.  Filtering

    a.  Add a filter by type (e.g. Fire, Water, Electric)

4.  Basic Caching

    a.  Cache fetched Pokémon details in memory (using React context or
        a custom hook)

    b.  Avoid refetching data unnecessarily if a user views the same
        Pokémon more than once

### Backend (Express + TypeScript)

- Create a lightweight Express API to manage favorite Pokémon

  - Endpoints:

    - Return a list of favorited Pokémon

    - Add a favorite Pokémon

    - Delete a favorite Pokémon

- Optional: Use sqlite for data persistence

## Technical Requirements

- Frontend: React and TypeScript

- Backend: NodeJS, Express, TypeScript

- You may use any styling or component libraries

- You may use any libraries for state management, HTTP requests,
  styling, etc.

- Consume the PokéAPI directly from the frontend.

- Use the scaffold provided in the repository provided to you.

## Deliverables

Please submit

1.  Your code to a separate branch in the provided repository.

2.  A README including:

    a.  Setup instructions

    b.  Assumptions, tradeoffs or notes you would like us to consider

    c.  Optional: what you'd improve or add with more time.
