import React from 'react';
import './assets/global.css';
import Grid from './components/Grid/Grid';
import { GridSocketProvider } from './contexts/GridSocketProvider';

function App() {
  return (
    <GridSocketProvider>
          <Grid />    
    </GridSocketProvider>   
  );
}

export default App;
     