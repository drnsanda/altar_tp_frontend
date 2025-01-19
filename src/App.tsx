import React from 'react';
import './assets/global.css';
import { GridSocketProvider } from './contexts/GridSocketProvider';
import { Routes, Route } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Payments from './pages/Payments';
import Home from './pages/Home';
function App() {
  return (
    <GridSocketProvider>
      <Routes>
        <Route path='/' index element={<Home />} />
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
