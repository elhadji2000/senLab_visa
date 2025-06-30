// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css';
import './app.css';

import AppRouter from './routes/AppRouter';
// import Assistant from './components/Assistant'; // Siri-like assistant

function App() {
  return (
    <>
      <AppRouter />
      {/* <Assistant /> */}
    </>
  );
}

export default App;
