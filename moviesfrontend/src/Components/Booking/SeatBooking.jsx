import React, { useContext, useEffect, useRef, useState } from 'react'
import movieCollage from '../../assets/movieCollage.jpg';
import posterCard from '../../assets/movieCollage.jpg';
import AddReview from '../Movies/AddReview';
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./SeatSelection.css";
import TimeScroller from './TimeScroller';
import Cookies from "js-cookie"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../UserContext';
import { loadStripe, } from '@stripe/stripe-js'
import { useElements, CardElement, useStripe } from "@stripe/react-stripe-js"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
const stripePromise = loadStripe('pk_test_51OWKAVSDJ0AxOUCaBITPNU4CmAR0Uey5xYo8uPMoVGjwox5LGoWkds5eg3WIFhLrcIZpNGQCzn6NWrhbP2AClk3k00CLeANSVp');
function SeatBooking() {
    const [showAddReview, setShowAddReview] = useState(false)
    const navigate = useNavigate();
    const { movieId, theatreId, showtimeId } = useParams();
    const [movie, setMovie] = useState(null);
    const [theatre, setTheatre] = useState(null);
    const { user, setUser } = useContext(UserContext)
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [sections, setSections] = useState({});
    const [showTimeDetails, setShowTimeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
   
    const elements = useElements();
    const stripe = useStripe();
    useEffect(() => {
      const fetchMovieDetails = async () => {
          try {
              const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/movies/getMovieDetails/${movieId}`);
              setMovie(response.data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching movie details:', error);
          }
      };

      
      fetchMovieDetails();
  }, [movieId]);
  useEffect(() => {
    const fetchTheatreDetails = async () => {
        try {
            const response = await axios.get(`https://cinema-trails.onrender.com/api/v1/theaters/getTheatreDetails/${theatreId}`);
            setTheatre(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

        fetchTheatreDetails();
    }, [theatreId]);
   
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const seatResponse = await axios.get(`https://cinema-trails.onrender.com/api/v1/showTimes/${showtimeId}/seats`);
                const showTimeDetailsResponse = await axios.get(`https://cinema-trails.onrender.com/api/v1/showTimes/getShowtimeById/${showtimeId}`);

                setShowTimeDetails(showTimeDetailsResponse.data);

console.log(showTimeDetails)
                const bookingResponse = await axios.get(`https://cinema-trails.onrender.com/api/v1/bookings/${showtimeId}`);

                const bookedSeats = bookingResponse.data.flatMap(booking => booking.seats.map(seat => seat.id));

                const updatedSeats = seatResponse.data.map(seat => ({
                    ...seat,
                    status: bookedSeats.includes(seat.id) ? 'booked' : seat.status
                }));

                console.log(updatedSeats);

                setSections(() => ({
                    Executive: {
                        price: `Rs. ${showTimeDetailsResponse.data?.ticketPrices.executive} Executive`,
                        rows: [],
                        centered: true, // Flag to center seats
                    },
                    Gold: {
                        price: `Rs. ${showTimeDetailsResponse.data?.ticketPrices.gold} Gold`,
                        rows: [],
                        centered: false,
                    },
                    Silver: {
                        price: `Rs. ${showTimeDetailsResponse.data?.ticketPrices.silver} Silver`,
                        rows: [],
                        centered: false,
                    },

                }))
                seatSectionCreater(updatedSeats)
                setSeats(updatedSeats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching seats or bookings:', error);
            }
        };
        fetchSeats();
    }, [showtimeId]);

    useEffect(() => {
        console.log('Currently selected seats:', selectedSeats);
    }, [selectedSeats]);

    const handleSeatClick = (seat) => {
        if (seat.status === 'occupied' || seat.status === 'booked') return;

        const isSelected = selectedSeats.some(s => s.id === seat.id);

        if (isSelected) {
            setSelectedSeats(prevSelectedSeats =>
                prevSelectedSeats.filter(s => s.id !== seat.id)
            );
            setTotalPrice(prevPrice => prevPrice - seat.price);
        } else {
            setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, seat]);
            setTotalPrice(prevPrice => prevPrice + seat.price);
        }
    };

    const handleBooking = async () => {
        try {
            if(!Cookies.get('token')){
                toast.error('Try loggin in first');
                return 
            }
            const paymentData = {
                amount: totalPrice,
                currency: 'inr',
                paymentMethodTypes: ['card'],
            };

            // Step 1: Create the PaymentIntent on the backend

            const paymentResponse = await axios.post('https://cinema-trails.onrender.com/api/v1/payment/payment', paymentData);
    

            if (paymentResponse.status !== 200) {
                throw new Error('Payment initialization failed');
            }

            const paymentIntent = paymentResponse.data.paymentIntent;

            if (!paymentIntent || !paymentIntent.client_secret) {
                throw new Error('Invalid PaymentIntent response');
            }
            const clientSecret = paymentIntent.client_secret;

            if (!stripe || !elements) {
                throw new Error('Stripe.js has not loaded');
            }

            // Step 2: Collect payment method using Stripe Elements
            const cardElement = elements.getElement(CardElement)
            if (!cardElement) {
                throw new Error('CardElement not found');
            }
            const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (methodError) {
                throw new Error(`Payment method creation failed: ${methodError.message}`);
            }

            // Step 3: Confirm the payment using the client secret and the payment method
            const { error: paymentError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (paymentError) {
                throw new Error(`Payment confirmation failed: ${paymentError.message}`);
            }

            // Step 4: Handle successful booking and payment confirmation
            const bookingData = {
                showtime: showTimeDetails._id,
                theatre: showTimeDetails.theatre,
                movie: showTimeDetails.movie,
                selectedSeats,
                totalTickets: selectedSeats.length,
                totalPrice,
                user: user._id,
                paymentId: confirmedPaymentIntent.id,
            };

    
            const response = await axios.post('https://cinema-trails.onrender.com/api/v1/bookings/addBooking', bookingData);

            if (response.status === 201) {
                const bookingId = response.data.booking._id;
                toast.success('Booking successful');
                setSelectedSeats([]);
                setTotalPrice(0);

                // Redirect to the ticket page
                navigate(`/ticket/${bookingId}`);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            toast.error('Booking failed');
        }
    };
    const seatSectionCreater = (seats) => {
        const chunkSeats = (seats, chunkSize) => {
            const chunks = [];
            for (let i = 0; i < seats.length; i += chunkSize) {
                chunks.push(seats.slice(i, i + chunkSize));
            }
            return chunks;
        };

        const organizeSeatsByRows = (seats, chunkSize) => {
            const rows = {};
            seats.forEach(seat => {
                const rowLabel = seat.id[0];
                if (!rows[rowLabel]) {
                    rows[rowLabel] = [];
                }
                rows[rowLabel].push(seat);
            });

            return Object.values(rows).flatMap(row => chunkSeats(row, chunkSize));
        };

        const executiveSeats = seats.filter(seat => seat.tier === 'executive');
        const goldSeats = seats.filter(seat => seat.tier === 'gold');
        const silverSeats = seats.filter(seat => seat.tier === 'silver');

        setSections((prev) => ({
            Executive: { ...prev.Executive, rows: organizeSeatsByRows(executiveSeats, 16) },
            Gold: { ...prev.Gold, rows: organizeSeatsByRows(goldSeats, 16) },
            Silver: { ...prev.Silver, rows: organizeSeatsByRows(silverSeats, 16) },
        }));
    };
    function CustomSkeleton() {
        return (
          <div className="max-w-4xl mx-auto px-6 py-2">
          
            {Array.from({ length: 5 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className='py-3'>
              
                <Skeleton height={20} width={100} />
      
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center mb-2">
                    <Skeleton width={30} height={20} className="text-gray-200 w-1/12" />
                    <div className="flex w-full items-center justify-center mb-2">
                      <div className="flex flex-wrap gap-2 gap-y-2">
                        {Array.from({ length: 10 }).map((_, seatIndex) => (
                          <Skeleton key={seatIndex} width={24} height={24} circle={true} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
return (
    <>
      <div className='relative w-full h-fit dark:text-white text-black mb-10'>
        {showAddReview && (
          <div className='absolute left-1/2 -top-10 z-30 w-full'>
            <AddReview setShowAddReview={setShowAddReview} />
          </div>
        )}
        <div className='-z-10 bg-opacity-10 bg-black dark:bg-opacity-100 w-full h-full fixed top-0'>
          <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
        </div>
        <div className='flex w-full flex-row items-center h-fit justify-evenly'>
          <div className='w-2/3 flex justify-start items-start'>
            <div className='w-full'>
              <div className='flex flex-col align-middle w-3/4 lg:ml-16 mt-8'>
                <div>
                  <Link to={`/movie/ShowListing/${movieId}`}>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                  </Link>
                </div>
                <div className='flex flex-row align-middle gap-16 items-center w-full justify-between'>
                  {loading ? (
                    <Skeleton width={200} height={30} />
                  ) : (
                    <h1 className='text-2xl font-semibold'>{movie?.title}</h1>
                  )}
                  {loading ? (
                    <Skeleton width={150} height={30} />
                  ) : (
                    <TimeScroller theatreId={theatreId} movieId={movieId} />
                  )}
                </div>
                <div>
                  {loading ? (
                    <Skeleton width={300} height={20} />
                  ) : (
                    <h1 className='text-xl font-semibold'>{theatre?.name}: {theatre?.city}, {theatre?.state}</h1>
                  )}
                </div>
                <div className='mb-3 flex align-middle items-center mt-2'>
                  <div className='flex gap-2'>
                    {/* Add any additional skeletons if needed */}
                  </div>
                </div>
              </div>
              <div className='h-fit'>
                <div className="max-w-4xl mx-auto px-6 py-2">
                  {loading ? (
                    <CustomSkeleton />
                  ) : (
                    Object.entries(sections).map(([section, sectionData], sectionIndex) => (
                      <div key={sectionIndex} className='py-3'>
                        <h2 className="text-lg font-semibold mb-2 text-left">{sectionData?.price || 0}</h2>
                        {Object.entries(sectionData.rows).map(([key, seats], rowIndex) => (
                          <div className="flex items-center" key={rowIndex}>
                            <span className="text-gray-200 w-1/12">{(String(seats[0].id).split('')[0])}</span>
                            <div className={`flex w-full items-center justify-center mb-2`}>
                              <div className={`flex flex-wrap gap-2 gap-y-2`}>
                                {seats.map((seat, seatIndex) => {
                                  const seatId = seat.id;
                                  const seatNumber = String(seat.id).slice(1,);
                                  const isBooked = seat.status === 'booked';
                                  const isSelected = selectedSeats.includes(seat);

                                  return (
                                    <button
                                      key={seatIndex}
                                      disabled={isBooked}
                                      onClick={() => handleSeatClick(seat)}
                                      className={`px-2 py-1 text-sm rounded ${isBooked
                                        ? "bg-yellow-400 cursor-not-allowed"
                                        : isSelected
                                          ? "bg-blue-500"
                                          : "bg-gray-400"
                                        } text-white`}
                                    >
                                      {seatNumber}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                  {/* Color Scheme Bar */}
                  <div className="mt-3 flex flex-col items-center justify-center ">
                    <div className="w-full flex justify-center ">
                      <div className="w-1/2 ml-20 h-10 dark:bg-gradient-to-r bg-white from-gray-200 via-gray-300 to-gray-200 rounded-b-full shadow-2xl text-center text-sm font-semibold text-gray-700 p-2">
                        <span>Cinema Screen</span>
                      </div>
                    </div>
                    <div className='mt-6 flex items-center justify-center gap-10'>
                      <div className="flex items-center space-x-2 ">
                        <span className="inline-block w-4 h-4 bg-gray-400 rounded"></span>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-4 h-4 bg-blue-500 rounded"></span>
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-4 h-4 bg-yellow-400 rounded"></span>
                        <span className="text-sm">Booked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col w-1/4 mr-16 gap-8 h-1/2'>
            <div className="w-full p-6 bg-white rounded-lg shadow-lg text-black align-middle justify-self-start">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              {loading ? (
                <>
                  <Skeleton width={150} height={20} />
                  <Skeleton width={100} height={20} />
                </>
              ) : (
                <>
                  <p className="text-sm mb-2">Number of Tickets: <span className="font-medium">{selectedSeats.length}</span></p>
                  <p className="text-sm mb-4">Total Price: <span className="font-medium">Rs {totalPrice}</span></p>
                </>
              )}
              <div className="mb-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>

              <button
                className={`w-full py-2 mt-4 text-sm font-semibold text-white rounded-lg transition-all ${selectedSeats.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={selectedSeats.length === 0}
                onClick={handleBooking}
              >
                Book
              </button>
            </div>
            <div>
              {loading ? (
                <Skeleton height={200} />
              ) : (
                <img src={movie?.images[0]} alt="" className='w-full h-full rounded-lg' />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SeatBooking