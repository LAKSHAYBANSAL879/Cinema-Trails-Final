import React, { useRef, useContext } from 'react';
import logo from '../../assets/logo1.png';
import ToggleButton from './ToggleButton';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Cookies from "js-cookie"
import { Button } from '@mui/material';
function Navbar() {
    const profileRef = useRef(null);
    const { user, setUser } = useContext(UserContext);
    const loggedIn = user !== null;
    const history = useNavigate();
    const handleProfileToggle = () => {
        profileRef.current.classList.toggle("hidden");
    };
    const handleLogout = () => {
        setUser(null);
        Cookies.remove("token");
        history("/LogIn");
    };

    return (
        <div>
            <nav className="bg-opacity-0 dark:bg-opacity-0 dark:bg-black bg-white border-gray-200 light:text-black dark:text-white sticky top-0 z-20 transition-all duration-500">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className='foldit-trails flex items-center justify-start mr-20 leading-[5rem]'>
                            <span className='text-4xl'>CINEMA</span>
                            <img className="h-14 dark:invert mx-2" src={logo} alt="Logo" />
                            <span className='text-4xl'>TRAILS</span>
                        </div>
                    </a>
                    <div className="flex relative items-center md:order-2 gap-4 md:space-x-0 rtl:space-x-reverse">
                        <ToggleButton />

                        {!loggedIn ? (
                            <Link to='/LogIn' className="relative inline-flex items-center justify-center p-0.5 overflow-hidden font-medium rounded-xl group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                <span className="relative px-5 py-2 transition-all ease-in duration-75 dark:bg-black bg-white rounded-xl group-hover:bg-opacity-0">
                                    Log in
                                </span>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={handleProfileToggle}
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full md:me-0 group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                        src={`https://cinema-trails.onrender.com/api/v1/auth/uploadss/${user?.profileImageUrl}`}
                                        alt="User Profile"
                                    />
                                </button>

                                <div ref={profileRef} onClick={handleProfileToggle} className="z-50 absolute hidden w-56 top-7 right-5 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
                                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        {user?.role === "user" ? (
                                            <Link to='/profileDetails'>
                                                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</div>
                                            </Link>
                                        ) : (
                                            <Link to='/admin'>
                                                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</div>
                                            </Link>
                                        )}

                                        <li>
                                            <Link to="/myReservations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Your reservations</Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                                        </li>
                                    </ul>
                                </div>
                                <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <input
                            type="text"
                            placeholder="Spotlight your next watch..."
                            className={`rounded-xl py-2.5 px-4 w-[30rem] text-gray-800  focus:outline-0 dark:bg-gray-900 bg-gray-300 dark:text-white`}
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
