// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // 👈 Import our new Login page

function App() {
  return (
    // BrowserRouter acts as the global router engine for the SPA
    <BrowserRouter>
      {/* Routes is the container that decides which component to render based on the URL */}
      <Routes>
        {/* If the user hits the root '/', redirect them immediately to the login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Map the '/login' URL path to our Login component */}
        <Route path="/login" element={<Login />} />

        {/* Future scaling: We will add our protected '/dashboard' or '/profile' routes here later 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;