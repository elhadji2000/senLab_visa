import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AppRouter from './routes/AppRouter'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter></AppRouter>
    </>
  )
}

export default App
