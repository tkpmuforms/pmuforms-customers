import React, { useEffect, useRef, useState } from "react";
import { LogoSvg } from "../../assets/svgs/AuthSvg";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import "./AuthenticatedNavbar.scss";
import useAuth from "../../context/useAuth";

const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const mobileMenuRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null); // For avatar dropdown
  const isDropdownOpen = Boolean(anchorEl);

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

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="authenticatedNavbarContainer">
      <div className="navlink">
        <div className="authLogo" onClick={() => navigate("/dashboard")}>
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
            {mobileMenuVisible && (
              <li className="mobile-logout">
                <span onClick={handleLogout}>Logout</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Right Aligned Content */}
      <div className="hamburger-avatar-container">
        <div className="avatar" onClick={handleAvatarClick}>
          <Avatar
            src={user?.info?.avatar_url ?? ""}
            alt={user?.name ?? user?.info?.client_name ?? ""}
            sx={{ width: 40, height: 40 }}
          />
        </div>
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          &#9776;
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={isDropdownOpen}
        onClose={handleDropdownClose}
        PaperProps={{
          style: {
            marginTop: "20px",
          },
        }}
      >
        <MenuItem>
          <Typography>{user?.name ?? user?.info?.client_name ?? ""}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default AuthenticatedNavbar;
