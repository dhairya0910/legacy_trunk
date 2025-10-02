import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/login.css"
// import Navbar from '../Components/navbar'
// improt Link

export default function Login() {
      const vw = window.innerWidth/100; // size of 1vw in px
      useEffect(() => {
        const form1 = document.querySelector(".form")
        console.log(vw,form1)
          form1.style.width=`${100-vw*5}vw`;
      
        return () => {
          
        }
      }, [])
      
  return (
    <>
    

      <form className="container1">
        <div className="form">
            <h3 className="tag">Login to <span className="title">GHAARONDHA</span></h3>
        <input className="input" type="email" name="email" id="" placeholder="xyz@gmail.com" />
        <input className="input" type="password" name="password" id="" placeholder="Password" />
        <button className="btn-primary1" type="submit">Login</button>
        <p className="new">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#78dbff" }}>
            Click here
          </Link>
        </p>
        </div>
      </form>
    </>
  );
}
