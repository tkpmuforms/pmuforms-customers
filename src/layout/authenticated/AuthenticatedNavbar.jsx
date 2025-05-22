import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoSvg } from "../../assets/svgs/AuthSvg";
import useAuth from "../../context/useAuth";
import "./AuthenticatedNavbar.scss";

const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const mobileMenuRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null); // Avatar dropdown
  const isDropdownOpen = Boolean(anchorEl);
  const businessName = localStorage.getItem("businessName");

  const USE_COMPANY_LOGO = Boolean(process.env?.USE_COMPANY_LOGO || true);

  const toggleMobileMenu = () => {
    handleDropdownClose(); // close avatar menu if open
    setMobileMenuVisible(!mobileMenuVisible);
  };
  // Close menu on outside click
  const handleClickOutside = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      !event.target.closest(".hamburger-menu") &&
      !event.target.closest(".avatar")
    ) {
      setMobileMenuVisible(false);
      setAnchorEl(null);
    }
  };

  // Close menu when navigating
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuVisible(false); // Close menu
  };

  const handleAvatarClick = (event) => {
    setMobileMenuVisible(false); // close mobile menu
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuVisible(false);
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
        <div
          className="authLogo"
          onClick={() => handleNavigation("/customer/dashboard")}
        >
          {USE_COMPANY_LOGO ? (
            <LogoSvg />
          ) : (
            <>
              <AccountBalanceOutlinedIcon />
              &nbsp;
              <p className="businessName">{businessName ?? ""}</p>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`authlinks ${mobileMenuVisible ? "visible" : ""}`}
        >
          <ul>
            <li>
              <Link
                to="/customer/dashboard"
                onClick={() => handleNavigation("/customer/dashboard")}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/customer/appointments"
                onClick={() => handleNavigation("/customer/appointments")}
              >
                Appointment Forms
              </Link>
            </li>
            <li>
              <Link to="/support" onClick={() => handleNavigation("/support")}>
                Contact Support
              </Link>
            </li>
            {mobileMenuVisible && (
              <li className="mobile-logout">
                <span onClick={handleLogout}>Logout</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Avatar & Hamburger Menu */}
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
        sx={{ marginTop: "20px" }}
      >
        <MenuItem>
          <Typography>{user?.info?.client_name ?? user?.name}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default AuthenticatedNavbar;
