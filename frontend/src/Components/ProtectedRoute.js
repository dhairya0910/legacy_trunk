// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${config.BACKEND_URL}/check-auth`, {
          method: "POST",
          credentials: "include", 
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            //console.log("auththt")
            setIsAuth(true);
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10 text-gray-400">Checking authentication...</div>;
  if (!isAuth) return null;

  return children;
}
