import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import { LogoSvg } from "../assets/svgs/AuthSvg";

const Navbar = ({ CreatenewClick }) => {
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
      setMobileMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHomeNavigate = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div onClick={handleHomeNavigate} className="logo">
        <LogoSvg />
      </div>
      <div
        ref={mobileMenuRef}
        className={`links ${mobileMenuVisible ? "visible" : ""}`}
      >
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/how-to">[Watch Video] “How to use PMU Forms”</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="buttons">
        <button className="download">Download App</button>
        <button onClick={CreatenewClick} className="create-an-account">
          Create an Account
        </button>
      </div>
      <div className="hamburger-menu" onClick={toggleMobileMenu}>
        &#9776;
      </div>
    </div>
  );
};

export default Navbar;
