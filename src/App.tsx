import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Capture from './pages/Capture';
import Review from './pages/Review';
import Report from './pages/Report';
import Compare from './pages/Compare';
import Estimate from './pages/Estimate';
import { InspectionProvider } from './context/InspectionContext';

function App() {
  return (
    <InspectionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/review" element={<Review />} />
            <Route path="/report" element={<Report />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </InspectionProvider>
  );
}

export default App;