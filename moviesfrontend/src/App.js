import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from '../src/Components/Home/Home';
import Footer from './Components/Navbar/Footer';
import { UserContextProvider } from './UserContext';
import LogIn from './Components/Auth/LogIn';
import SignUp from './Components/Auth/SignUp';
import ProfileDetails from './Components/Auth/ProfileDetails';
import ProfileEdit from './Components/Auth/ProfileEdit';
import MovieDetails from './Components/Movies/MovieDetails';
import ShowListing from './Components/Theatres/ShowListing';
import SeatBooking from './Components/Booking/SeatBooking';
import ForgetPassword from './Components/Auth/ForgotPassword';
import Ticket from './Components/Booking/Ticket';
import { DateProvider } from './DateContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Dashboard from './Components/Admin/Dashboard';
import MoviesTicket from './Components/Admin/MoviesTicket';
import MovieDetail from './Components/Admin/MovieDetail';
import TheatreList from './Components/Admin/TheatreList';
import ShowTimeList from './Components/Admin/ShowTimeList';
import Reservations from './Components/Auth/Reservations';
import BookingList from './Components/Admin/BookingList';
import NotFound from './Components/Home/NotFound';
const stripePromise = loadStripe('pk_test_51OWKAVSDJ0AxOUCaBITPNU4CmAR0Uey5xYo8uPMoVGjwox5LGoWkds5eg3WIFhLrcIZpNGQCzn6NWrhbP2AClk3k00CLeANSVp');
function App() {
  return (
    <div>
      <UserContextProvider>
        <DateProvider>
          <Navbar />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/LogIn' element={<LogIn />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/ForgetPassword' element={<ForgetPassword />} />

            <Route path='/profileDetails' element={<ProfileDetails />} />
            <Route path='/myReservations' element={<Reservations />} />

            <Route path='/profileEdit' element={<ProfileEdit />} />
            <Route path='/movieDetails/:movieId' element={<MovieDetails />} />
            <Route path='/movie/ShowListing/:movieId' element={<ShowListing />} />
            <Route
              path='/seatBooking/:movieId/:theatreId/:showtimeId'
              element={
                <Elements stripe={stripePromise}>
                  <SeatBooking />
                </Elements>
              }
            />


    <Route path='/ticket/:bookingId' element={<Ticket/>} />
    <Route path='/admin' element={<AdminDashboard />} >
            <Route index element={<Dashboard />} />
            <Route path='/admin/movies' element={<MoviesTicket />} />
            <Route path='/admin/movies/:movieId' element={<MovieDetail />} />
            <Route path='/admin/theaters' element={<TheatreList />} />
            <Route path='/admin/showtimes' element={<ShowTimeList />} />
            <Route path='/admin/bookings' element={<BookingList />} />
          </Route>
            <Route path='*' element={<NotFound/>} />

          </Routes>
          <Footer />
        </DateProvider>
      </UserContextProvider>

    </div>
  );
}

export default App;