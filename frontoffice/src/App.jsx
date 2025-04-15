import { useState } from 'react';
import AppRouter from './routes/AppRouter';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './components/Header.css'

function App() {

  return (
    <>
      <AppRouter></AppRouter>
    </>
  )
}

export default App
