import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/login.css";
import googleIcon from "../assets/Images/google.svg";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3128/auth/google";
  };

  return (
    <form className="container1">
      <div className="form">
        <h3 className="tag">
          Login to <span className="title">GHARONDHA</span>
        </h3>

        <div className="flex justify-center my-6">
          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleLogin}
          >
            <img src={googleIcon} alt="Google" className="h-6 w-6 mr-3" />
            Continue with Google
          </button>
        </div>

        <p className="new">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#78dbff" }}>
            Click here
          </Link>
        </p>
      </div>
    </form>
  );
}
