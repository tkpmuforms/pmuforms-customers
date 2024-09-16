import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';
import { LogoSvg } from '../assets/svgs/AuthSvg';

const Navbar = ({
  CreatenewClick
}) => {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="navbar__logo">
        <LogoSvg/>
      </div>
      
      {/* Links in the center */}
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/watch-video" className="navbar__link">[Watch Video] “How to use PMU Forms”</Link>
        <Link to="/about" className="navbar__link">About</Link>
      </div>
      
      {/* Buttons on the right */}
      <div className="navbar__buttons">
        <button className="navbar__button navbar__button--outline">Download App</button>
        <button className="navbar__button navbar__button--primary" onClick={CreatenewClick}>Create an Account</button>
      </div>
    </nav>
  );
};

export default Navbar;
