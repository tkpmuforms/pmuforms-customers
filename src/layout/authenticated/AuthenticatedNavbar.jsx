import React, { useEffect, useRef, useState } from "react";
import { LogoSvg } from "../../assets/svgs/AuthSvg";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import "./AuthenticatedNavbar.scss";

const AuthenticatedNavbar = () => {
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

  return (
    <div className="authenticatedNavbarContainer">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="authLogo" onClick={() => navigate("/")}>
          <LogoSvg />
        </div>
        <div
          ref={mobileMenuRef}
          className={`authlinks ${mobileMenuVisible ? "visible" : ""}`}
        >
          <ul>
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/appointments">Appointments</Link>
            </li>
            <li>
              <Link to="/support">Contact Support</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Aligned Content */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="avatar">
          <Avatar />
        </div>
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          &#9776;
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedNavbar;
