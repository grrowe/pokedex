import { Provider } from "@/components/ui/provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { PokemonProvider } from "./utils/PokeContext.tsx";
import { UserProvider } from "./utils/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <UserProvider>
        <PokemonProvider>
          <App />
        </PokemonProvider>
      </UserProvider>
    </Provider>
  </StrictMode>
);
