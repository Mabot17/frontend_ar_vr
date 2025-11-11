import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import InventoryPage from './pages/InventoryPage';
import EquipPage from './pages/EquipPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/equip" element={<EquipPage />} />
      </Routes>
    </Router>
  );
}

export default App;