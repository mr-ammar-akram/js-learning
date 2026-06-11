// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from './pages/auth/RegisterForm';
import Homepage from './pages/view/Homepage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
