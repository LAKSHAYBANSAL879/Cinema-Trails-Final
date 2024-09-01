import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { faChartBar, faClock, faBuilding, faVideo, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../UserContext';
import movieCollage from '../../assets/movieCollage.jpg';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {

      navigate('/profileDetails');
    }
  }, [user, navigate]);

  return (
    <div className="flex relative md:flex-row flex-col h-screen ">
      <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
        <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
      </div>
      <aside className="md:w-56 w-full shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold dark:text-gray-100 text-gray-800 ">Admin Panel</h2>
        </div>
        <nav className="md:mt-6 -mt-5 flex md:flex-col gap-0 md:gap-1">
          {[
            { text: 'Dashboard', icon: faChartBar, link: '/admin' },
            { text: 'Movies', icon: faVideo, link: '/admin/movies' },
            { text: 'Theaters', icon: faBuilding, link: '/admin/theaters' },
            { text: 'Showtimes', icon: faClock, link: '/admin/showtimes' },
            { text: 'Bookings', icon: faTicket, link: '/admin/bookings' },
          ].map((item) => (
            <Link
              key={item.text}
              to={item.link}
              className="flex flex-row items-center px-2 md:px-6 py-3 dark:text-gray-200 text-gray-700  dark:hover:bg-gray-700 hover:bg-gray-300"
            >
              <FontAwesomeIcon icon={item.icon} className="sm:w-5 sm:h-5 sm:mr-3 w-2 h-2 mr-1" />
              <span className='sm:text-base text-sm'>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 bg-opacity-80 dark:bg-opacity-5 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
