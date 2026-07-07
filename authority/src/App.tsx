import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import LiveMap from './pages/LiveMap';
import ReportQueue from './pages/ReportQueue';
import SensorNetwork from './pages/SensorNetwork';
import RepairCrews from './pages/RepairCrews';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="reports" element={<ReportQueue />} />
            <Route path="sensors" element={<SensorNetwork />} />
            <Route path="crews" element={<RepairCrews />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
