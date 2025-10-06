import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import  "../assets/styles/login.css"
import config from "../config"
import google from "../assets/Images/google.svg"
import insta from "../assets/Images/insta.svg"
import fb from "../assets/Images/fb.svg"
// improt Link

export default function Signup() {
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
            <h3 className="tag">Signup to <span className="title">GHARONDHA</span></h3>
            <div className="flex justify-evenly gap-6 my-7">

            <div><img src={google} alt="" srcset="" className="h-10 rounded-3xl w-10" id="google" /></div>
            <div><img src={insta} alt="" srcset="" className="h-10 rounded-3xl w-10" id="instagram" /></div>
            <div><img src={fb} alt="" srcset="" className="h-10 rounded-3xl w-10" id="facebook" /></div>
            </div>
        <p className="new">
          Existing user?{" "}
          <Link to="/login" style={{ color: "#78dbff" }}>
            Click here
          </Link>
        </p>
        </div>
      </form>
    </>
  );
}
