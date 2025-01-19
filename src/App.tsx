import React from 'react';
import './assets/global.css';
import Grid from './components/Grid/Grid';
import { GridSocketProvider } from './contexts/GridSocketProvider';
import {Routes,Route} from 'react-router';
import Payments from './components/Payments/Payments';
import 'react-toastify/dist/ReactToastify.css';   
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <GridSocketProvider>
      <Routes>
        <Route path='/' index element={<Grid />} />
        <Route path='/payments' index element={<Payments />} />   
      </Routes>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    </GridSocketProvider>   
  );
}

export default App;
     