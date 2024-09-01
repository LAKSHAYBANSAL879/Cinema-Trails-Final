import { Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Box } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import movieCollage from '../../assets/movieCollage.jpg';
import cinemaPng from '../../assets/cinemaFoods.png'
import cinemaReel from '../../assets/cinemaReel1.png'

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");
  const [error, setError] = useState("");


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    checkPasswordMatch(e.target.value);
  };

  const checkPasswordMatch = (confirmPass) => {
    if (password !== confirmPass) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };
  const registerUser = async (ev) => {
    ev.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);

      if (profileImageUrl) {
        formData.append("profileImageUrl", profileImageUrl);
      }


     const response= await axios.post("https://cinema-trails.onrender.com/api/v1/auth/signup", formData);
      setUserId(response.data.data.userId);  
      setStep(2);  
      
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again.");
    }
  };
  const verifyOtp = async () => {
    try {
      const response = await axios.post("https://cinema-trails.onrender.com/api/v1/auth/verifyOtp", { userId, otp });
      if (response.data.success) {
        navigate("/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("OTP verification failed. Please try again.");
    }
  };
  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className='relative text-black dark:text-white flex justify-start'>
      <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
        <img src={movieCollage} className='dark:opacity-5 opacity-5 dark:invert-0 invert' alt='' />
      </div>
      <div className="shadow-m rounded-lg relative ml-16 max-w-2xl w-full ">
        {step!=2&&<div className="flex items-start justify-between p-2.5">
          <h3 className="text-2xl font-semibold">Create an account</h3>
        </div>}
        

        <div className="p-3 space-y-6">
          {step === 1 && (
            <form onSubmit={registerUser} encType="multipart/form-data">
              <div className="grid grid-cols-6 gap-5">
                <Box display="flex" justifyContent="center" mb={2} ml={36} position="relative">
                  <Avatar alt="Profile Preview" src={imagePreview} sx={{ width: 120, height: 120 }} />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span" sx={{ position: 'absolute', top: 84, left: 20, color: "gray" }}>
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>

                {/* Full Name */}
                <div className="col-span-6">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      name="name"
                      type="text"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      autoComplete="name"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      Full Name
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-6 sm:col-span-2">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      id="city"
                      name="city"
                      type="text"
                      value={city}
                      onChange={(ev) => setCity(ev.target.value)}
                      autoComplete="city"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      City
                    </label>
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-2">
                  <div class="relative w-full min-w-[200px] h-10">
                    <input
                      class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                      placeholder=" " id="state"
                      name="state"
                      type="text"
                      value={state}
                      onChange={(ev) => setState(ev.target.value)}
                      autoComplete="state" required />
                    <label
                      class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                      for="state">State
                    </label>
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-2">
                  <div class="relative w-full min-w-[200px] h-10">
                    <input
                      class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                      placeholder=" " id="country"
                      name="country"
                      type="text"
                      value={country}
                      onChange={(ev) => setCountry(ev.target.value)}
                      autoComplete="country" required />
                    <label
                      class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                      for="country">Country
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-6">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      autoComplete="email"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      Email
                    </label>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      name="phone"
                      type="number"
                      value={phone}
                      onChange={(ev) => setPhone(ev.target.value)}
                      autoComplete="phone"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      Mobile Number
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      Password
                    </label>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                      placeholder=" "
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      autoComplete="new-password"
                      required
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500">
                      Confirm Password
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <div className="col-span-6">
                  <button
                    type="submit"
                    className="w-full dark:text-black dark:bg-gray-200 bg-gray-800 text-white hover:bg-gray-700 dark:hover:bg-white hover:border-black border focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 text-center"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <p className="ext-sm mt-5 font-normal text-gray-600 dark:text-gray-400">
                Already have an account? <Link to="/LogIn" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
              </p>
            </form>
          )}
          {step === 2 && (
            <div className='h-[32rem] flex justify-center items-center'>
              <div>
                <p>An OTP has been sent to your email. Please enter it below to complete your signup.</p>
                <div className="relative w-full min-w-[200px] h-10 my-5">
                  <input
                    type="text"
                    name='otp'
                    id='otp'
                    placeholder=""
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                  />
                  <label
                    className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                    htmlFor="otp">OTP
                  </label>
                </div>
                <button onClick={verifyOtp} className="w-full dark:text-black dark:bg-gray-200 bg-gray-800 text-white hover:bg-gray-700 dark:hover:bg-white hover:border-black border focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 text-center">
                  Verify OTP
                </button>
                {error && <p className="text-red-600">{error}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=''>
        <div className=''>
          <img src={cinemaPng} className='w-1/3 absolute top-0  z-1 left-1/2 opacity-80' alt='cinemaPng' />
          <img src={cinemaReel} className='w-1/4 absolute top-2/3 z-1  left-2/3 opacity-80' alt='cinemaReel' />
        </div>
      </div>
    </div>
  );
}

export default SignUp;

