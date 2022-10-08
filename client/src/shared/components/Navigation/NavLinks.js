import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

import { AuthContext } from '../context/auth-context';

const NavLinks = props => {

    const auth = useContext(AuthContext)
    console.log(auth.userId)
  return (
    <ul className='nav-links'>
        <li>
            <NavLink to='/' exact>All Users</NavLink>
        </li>
        { auth.isLoggedIn && 
        <li>
            <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>
        }
        { auth.isLoggedIn &&
        <li>
            <NavLink to='/places/new'>Add Place</NavLink>
        </li>
        }
        { !auth.isLoggedIn && 
        <li>
            <NavLink to='/auth'>Login</NavLink>
        </li>
        }
        { auth.isLoggedIn && 
        <li>
            <button onClick={auth.logout}>Logout</button>
        </li>
        }
    </ul>
  )
}

export default NavLinks