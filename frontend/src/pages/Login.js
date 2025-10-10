import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/login.css";
import config from "../config";
import google from "../assets/Images/google.svg";
import insta from "../assets/Images/insta.svg";
import fb from "../assets/Images/fb.svg";

export default function Signup() {
  const handleGoogle = () => {
    window.open(`${config.BACKEND_URL}/auth/google`, "_self");
  }

  return (
    <>
      <form className="container1">
        <div className="form">
          <h3 className="tag">
            Login to <span className="title">GHARONDHA</span>
          </h3>

          <div className="flex justify-evenly gap-6 my-7">
            <div>
              <img
                src={google}
                alt="Google"
                className="h-10 rounded-3xl w-10"
                id="google"
                onClick={handleGoogle}
              />
            </div>
            <div>
              <img
                src={insta}
                alt="Instagram"
                className="h-10 rounded-3xl w-10"
                id="instagram"
              />
            </div>
            <div>
              <img
                src={fb}
                alt="Facebook"
                className="h-10 rounded-3xl w-10"
                id="facebook"
              />
            </div>
          </div>

          <p className="new">
            Existing user?{" "}
            <Link to="/signup" style={{ color: "#78dbff" }}>
              Click here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
