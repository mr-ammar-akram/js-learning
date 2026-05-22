// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from './pages/RegisterForm';
import Homepage from './pages/Homepage';
import Testpage from './pages/Testpage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/testpage" element={<Testpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
