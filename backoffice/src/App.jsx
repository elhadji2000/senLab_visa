import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AppRouter from './routes/AppRouter';
import Assistant from './components/Assistant'; // ← Ajouter ceci

function App() {
  return (
    <>
      <AppRouter />
      {/* <Assistant />  */}{/* Affiche l'icône Siri-like partout */}
    </>
  );
}

export default App;
