import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div className='nav-wrapper white'>
        <Link to='/' className='brand-logo left'>
          SearchingYard
        </Link>
        <ul id='nav-mobile' className='right'>
          <li>
            <Link to='/signin'>signin</Link>
          </li>
          <li>
            <Link to='/signup'>signup</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
