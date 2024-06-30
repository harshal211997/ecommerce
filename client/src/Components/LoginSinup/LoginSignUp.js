import React, { useState } from "react";
import "./LoginSignUp.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    //console.log(name, email, password);
    let item = { name, email, password };
    let result = await fetch("http://localhost:8000/api/v1/users/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });
  }
  async function login() {
    let item = { email, password };
    let result = await fetch("http://localhost:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });
  }
  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email ID"
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
      </div>
      {action === "Sign Up" ? (
        <div className="forgot-password">
          Have an Account?{" "}
          <span
            onClick={() => {
              setAction("Login");
              // signUp();
            }}
          >
            Login
          </span>
        </div>
      ) : (
        <div className="forgot-password">
          Don't have an Account?{" "}
          <span
            onClick={() => {
              setAction("Sign Up");
              // signUp();
            }}
          >
            SignUp
          </span>
        </div>
      )}
      {action === "Sign Up" ? (
        <div></div>
      ) : (
        <div className="forgot-password">
          Lost Password? <span>Click Here</span>
        </div>
      )}
      <div className="submit-cintainer">
        <div
          className="submit"
          onClick={() => {
            action === "Login" ? login() : signUp();
          }}
        >
          {action === "Login" ? "Login" : "SignUp"}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
