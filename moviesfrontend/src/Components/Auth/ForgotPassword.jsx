import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import cinemaPng from '../../assets/cinemaFoods.png';
import cinemaReel from '../../assets/cinemaReel1.png';
import movieCollage from '../../assets/movieCollage.jpg';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://cinema-trails.onrender.com/api/v1/auth/forgot-password', { email });
            setMessage(response.data.message);
            setStep(2);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://cinema-trails.onrender.com/api/v1/auth/reset-password', { otp, password: newPassword });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className='relative w-full h-[38rem] flex items-center dark:text-white text-black justify-start'>
            <div className='-z-10  bg-opacity-10 bg-black dark:bg-opacity-100  w-full h-full fixed top-0'>
                <img src={movieCollage} className='dark:opacity-5 opacity-5' alt='' />
            </div>
            <div className="shadow-m rounded-lg relative ml-40 max-w-lg w-full">
                <div className="w-full justify-between p-5">
                    <h3 className="text-2xl font-semibold">
                        {step === 1 ? 'Forgot Password?' : 'Reset Your Password'}
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    {message && <p className="text-sm text-red-500">{message}</p>}
                    <form onSubmit={step === 1 ? handleEmailSubmit : handleResetPassword}>
                        <div className="grid grid-cols-6 gap-8">
                            {step === 1 && (
                                <div className="col-span-6">
                                    <div className="relative w-full min-w-[200px] h-10">
                                        <input
                                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                                            placeholder=" "
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label
                                            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                                            htmlFor="email">
                                            Email
                                        </label>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="col-span-6">
                                        <div className="relative w-full min-w-[200px] h-10">
                                            <input
                                                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                                                placeholder=" "
                                                id="otp"
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                            <label
                                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                                                htmlFor="otp">
                                                OTP
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-span-6">
                                        <div className="relative w-full min-w-[200px] h-10">
                                            <input
                                                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-500"
                                                placeholder=" "
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <label
                                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-900 dark:text-gray-200 dark:peer-focus:text-gray-100 peer-focus:text-gray-800 before:border-blue-gray-200 peer-focus:before:!border-gray-500 after:border-blue-gray-900 peer-focus:after:!border-gray-500"
                                                htmlFor="newPassword">
                                                New Password
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center p-6 space-x-2 rounded-b">
                            <button
                                type="submit"
                                className="w-full dark:text-black dark:bg-gray-200 bg-gray-800 text-white hover:bg-gray-700 dark:hover:bg-white hover:border-black border focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 text-center">
                                {step === 1 ? 'Send OTP' : 'Reset Password'}
                            </button>
                        </div>
                        {step === 1 && (
                             <p className="text-sm mt-5 font-normal text-gray-600 dark:text-gray-400">
                            Don't have an account yet? <Link to="/SignUp" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                        </p>
                        )}
                    </form>
                </div>
            </div>
            <div>
                <div>
                    <img src={cinemaPng} className="w-1/3 absolute top-0 z-1 left-1/2 opacity-80" alt="cinemaPng" />
                    <img src={cinemaReel} className="w-1/4 absolute top-2/3 z-1 left-2/3 opacity-80" alt="cinemaReel" />
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
