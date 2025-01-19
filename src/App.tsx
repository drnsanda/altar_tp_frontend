import React from 'react';
import './assets/global.css';
import Grid from './components/Grid/Grid';
import { GridSocketProvider } from './contexts/GridSocketProvider';
import {Routes,Route} from 'react-router';
import Payments from './components/Payments/Payments';
function App() {
  return (
    <GridSocketProvider>
      <Routes>
        <Route path='/' index element={<Grid />} />
        <Route path='/payments' index element={<Payments />} />   
      </Routes>
    </GridSocketProvider>   
  );
}

export default App;
     