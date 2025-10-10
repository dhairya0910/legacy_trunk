import "./App.css";
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stories from "./Components/Stories";
import ProtectedRoute from "./Components/ProtectedRoute";
import FamilySelection from "./Components/FamilySelection";
import YourPosts from "./pages/YourPosts";
import Profile from "./pages/Profile";
import Socket from "./api/Socket";
import InviteMember from "./pages/InviteMember";
import Requests from "./pages/Requests";
import CardExpand from "./Components/CardExpand";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/:who/view-stories"
            element={
              <ProtectedRoute>
                <Stories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-select"
            element={
              <ProtectedRoute>
                <FamilySelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <YourPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/socket"
            element={
              <ProtectedRoute>
                <Socket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite"
            element={
              <ProtectedRoute>
                <InviteMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view/post/:id"
            element={
              <ProtectedRoute>
                <CardExpand />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
