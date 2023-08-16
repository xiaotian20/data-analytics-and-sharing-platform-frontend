import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AgencyPage from './AgencyPage';
import DataPage from './DataPage';
import RegisterPage from './RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AgencyPage />} />
      <Route path="/datapage" element={<DataPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;



