import './App.css';
import Scene from "./ThatOpen/Scene"
import { StoreProvider } from './stores/StoreProvider';
import {ThemeProvider} from "./ThatOpen/Panels/Theme";
import React from "react";

function App() {
    return  (

      <StoreProvider>
          <ThemeProvider>
              <Scene/>
          </ThemeProvider>
      </StoreProvider>
  )
}
export default App;
