import React from "react";
import "./LoginSignUp.css";
import "../VerifyEmail.css";
import password_icon from "../Assets/password.png";
import { useLocation } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  let email = location.state.email;
  const l1 = email.split("@")[0];
  const l2 = email.split("@")[1];
  let replaceStr = l1.substring(0, 3);
  let formatedEmail = replaceStr.padEnd(l1.length, "*").concat(l2);
  return (
    <div className="container">
      <div className="header">
        <div className="text">Verify your Email</div>
        <div className="underline"></div>
        <div className="emailText">
          Enter 8 digit code you have recived on
          <div>{formatedEmail}</div>
        </div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="text" placeholder="Enter OPT sent on your Email" />
        </div>
      </div>
      <div className="submit-cintainer">
        <div className="submit">Verify</div>
      </div>
    </div>
  );
}
