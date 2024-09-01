import gsap from 'gsap';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

function ShowTime({ idx, show, theatreId }) {
    const showtimeRef = React.useRef(null);
    const { movieId } = useParams();
    console.log("Show ID (showTimeId):", show.id);
    return (
        <Link to={`/seatBooking/${movieId}/${theatreId}/${show.id}`}

            onMouseEnter={() => {
                gsap.to(showtimeRef.current, {
                    opacity: 1,
                    display: 'flex',
                    duration: 0.2,
                });
            }}
            onMouseLeave={() => {
                gsap.to(showtimeRef.current, {
                    opacity: 0,
                    display: 'none',
                    duration: 0.2,
                });
            }}
            key={idx}
            className={`px-4 py-2 relative rounded ${show.time.includes("PM") ? "text-orange-500" : "text-green-500"
                } border border-gray-900 dark:border-gray-300`}
        >
            <div >
                {show.time}
            </div>
            <div
                ref={showtimeRef}
                className="bg-white dark:bg-gray-200 opacity-0 z-30 shadow-lg p-4 rounded-lg absolute -left-5 top-full justify-between hidden gap-5"
            >
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white absolute -top-2 left-1/2 transform -translate-x-1/2"></div>

                <div className="text-center">
                    <p className="text-lg font-semibold text-nowrap">Rs. {show.ticketPrices.executive}</p>
                    <p className="text-sm text-gray-500">Executive</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-nowrap">Rs. {show.ticketPrices.gold}</p>
                    <p className="text-sm text-gray-500">Gold</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-nowrap">Rs. {show.ticketPrices.silver}</p>
                    <p className="text-sm text-gray-500">Silver</p>
                </div>
            </div>
        </Link>
    );
}

export default ShowTime;
