// import logo from './logo.svg';
import './App.css';
import Homepage from './pages/Homepage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Stories from './Components/Stories'
import { Helmet } from 'react-helmet';
import FamilySelection from './Components/FamilySelection';
import YourPosts from './pages/YourPosts';

function App() {
  return <>
  
    
   <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-stories" element={<Stories/>} />
        <Route path="/family-select" element={<FamilySelection/>} />
        <Route path="/posts" element={<YourPosts/>} />

      </Routes>
    </Router>
  </>
}

export default App;
