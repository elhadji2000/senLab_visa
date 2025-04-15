import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Footer2 from '../components/Footer2';

function AppRouter() {
    return (
        <Router>
            <div className="page-container">

                {/* Contenu principal */}
                <main className="container-fluid">
                    <Routes>
                        <Route path="/log" element={<Login></Login>} />
                        {/* Ajoutez vos autres routes ici */}
                    </Routes>
                </main>
                <Footer2></Footer2>
            </div>
        </Router>
    );
}

export default AppRouter