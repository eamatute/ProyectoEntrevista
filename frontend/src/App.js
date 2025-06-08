import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ProcessPage from './pages/ProcessPage';
import QuarantinePage from './pages/QuarantinePage';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <span className="navbar-brand">Proyecto Entrevista</span>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Carga de CSV</Link>
          <Link className="nav-link" to="/procesar">Procesar por fecha</Link>
          <Link className="nav-link" to="/cuarentena">Ver quarantine</Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/procesar" element={<ProcessPage />} />
          <Route path="/cuarentena" element={<QuarantinePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

