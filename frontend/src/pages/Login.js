import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../assets/styles/login.css"
import config from "../config"
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


      
  const [form, setForm] = useState(null);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    // dispatch(showSpinner("flex"))
    console.log(form)
    e.preventDefault();
    try {
      const res = await fetch(`${config.APP_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        console.log("Login failed");
     
        throw new Error("Login failed");
      } else {
       
      }
      
      
    } catch (error) {
     
    }
  };

      
  return (
    <>
    

      <form className="container1" onSubmit={handleSubmit}>
        <div className="form">
            <h3 className="tag">Login to <span className="title">GHARONDHA</span></h3>
        <input className="input" onChange={handleChange} type="email" name="email" id="" placeholder="xyz@gmail.com" />
        <input className="input" onChange={handleChange} type="password" name="password" id="" placeholder="Password" />
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
