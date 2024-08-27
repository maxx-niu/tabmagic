import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: FC = () => {
  return (
    <header>
        <div className='header-content'>
            <h1>TabMagic</h1>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/about">What is it?</Link></li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;