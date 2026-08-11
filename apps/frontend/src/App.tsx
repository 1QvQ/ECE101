// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Activities from './pages/Activities';
import Knowledge from './pages/Knowledge';
import Documents from './pages/Documents';
import Legal from './pages/Legal';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/documents" element={<Documents />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
