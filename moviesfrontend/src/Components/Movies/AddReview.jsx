import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import gsap from "gsap";

const AddReview = ({ onAddReviewSuccess, setShowAddReview }) => {
  const addReviewRef = useRef(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const { movieId } = useParams();

  useEffect(() => {
    gsap.to(addReviewRef.current, {
      opacity: 1,
      duration: 0.5
    })
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      rating: parseInt(rating),
      reviewText: comment,
      user: name,
    };

    try {
      const response = await axios.post(
        `https://cinema-trails.onrender.com/api/v1/movies/${movieId}/addReview`,
        newReview
      );
      onAddReviewSuccess(response.data);
      toast.success("Review added successfully!");
      setName("");
      setRating("");
      setComment("");
      setShowAddReview(false);
    } catch (error) {
      console.error("Error adding review:", error.response?.data?.error || error.message);
      toast.error("Failed to add review. Please try again.");
    }
  };

  return (
    <div className="opacity-0" ref={addReviewRef}>

      <form onSubmit={handleSubmit} className="grid fixed text-black dark:text-white bg-opacity-50 darK:text-white backdrop-blur-md w-full bg-white dark:bg-black dark:bg-opacity-90 grid-cols-6 gap-6  max-w-2xl mx-auto my-32 border-2 dark:border-gray-900 border-gray-300 p-10 rounded-lg">
        {/* Name Input */}
        <div className="col-span-6">
          <div className="flex items-center mb-10 ">
            <h1 className="text-2xl font-semibold w-full ">Add review</h1>
            <div className="border border-gray-500 px-3 rounded-full py-1 cursor-pointer"
              onClick={
                () => {
                  gsap.to(addReviewRef.current, { opacity: 0, duration: 0.5 });
                  setTimeout(() => { setShowAddReview(false) }, 600)
                }
              } >
              <i class="fa-solid fa-xmark" ></i>
            </div>
          </div>
          <div className="relative w-full min-w-[200px] h-10">
            <input
              className="peer w-full h-full bg-transparent text-gray-800 dark:text-gray-100 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-100 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-300 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-blue-500"
              placeholder=" "
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label
              className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 dark:peer-focus:text-gray-100 peer-focus:text-gray-700 before:border-gray-300 peer-focus:before:border-blue-500 after:border-gray-300 peer-focus:after:border-blue-500"
              htmlFor="name"
            >
              Name
            </label>
          </div>

        </div>
        {/* Rating Input */}
        <div className="col-span-6">
          <div className="relative w-full min-w-[200px] h-10">
            <input
              className="peer w-full h-full bg-transparent text-gray-800 dark:text-gray-100 font font-sans font-normal outline-none focus:outline-none disabled:bg-gray-100 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-300 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-blue-500"
              placeholder=" "
              id="rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            <label
              className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 dark:peer-focus:text-gray-100 peer-focus:text-gray-700 before:border-gray-300 peer-focus:before:border-blue-500 after:border-gray-300 peer-focus:after:border-blue-500"
              htmlFor="rating"
            >
              Rating
            </label>
          </div>
        </div>
        {/* Comment Input */}
        <div className="col-span-6">
          <div className="relative w-full min-w-[200px] h-10">
            <input
              className="peer w-full h-full bg-transparent text-gray-800 dark:text-gray-100 font font-sans font-normal outline-none focus:outline-none disabled:bg-gray-100 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-300 placeholder-shown:border-t-gray-300 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-blue-500"
              placeholder=" "
              id="comment"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <label
              className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 dark:peer-focus:text-gray-100 peer-focus:text-gray-700 before:border-gray-300 peer-focus:before:border-blue-500 after:border-gray-300 peer-focus:after:border-blue-500"
              htmlFor="comment"
            >
              Comment
            </label>
          </div>
        </div>
        {/* Submit Button */}
        <div className="col-span-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
