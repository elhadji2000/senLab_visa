import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import About from '../pages/About';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';

function AppRouter() {
    return (
        <Router>
            <div className="page-container">
                {/* Header fixe en haut */}
                <Header />

                {/* Contenu principal */}
                <main className="content-wrap">
                    <Routes>
                        <Route path="" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        {/* Ajoutez vos autres routes ici */}
                    </Routes>
                </main>

                {/* Footer toujours en bas */}
                <Footer />
                <Footer2></Footer2>
            </div>
        </Router>
    );
}

export default AppRouter;