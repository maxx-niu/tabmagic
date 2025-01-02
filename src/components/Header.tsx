import React, { FC } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header: FC = () => {
  return (
    <header>
      <div className="header-content">
        <Link to="/" className="home-nav">
          <h1>TabMagic</h1>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/overview" className="nav-link">
                What is it?
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="nav-link">
                How it Works
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About the Developer
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
