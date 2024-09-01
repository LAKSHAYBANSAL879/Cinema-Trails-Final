import React from 'react'

export default function Reviews({ reviews }) {
    return (
        <div id='Reviews' className=''>
            <div className="dark:bg-gray-800 bg-gray-400 bg-opacity-80 dark:bg-opacity-50 dark:text-white text-black h-fit rounded-lg shadow-lg p-6 mx-auto my-5">
                <h2 className="text-xl font-semibold mb-6  ">Reviews</h2>
                <div className='grid grid-cols-2 gap-2 '>

                    {reviews.length > 0 ?reviews.map((review, index) => (
                        <div key={index} className=" col-span-1  py-4 w-full  bg-gray-800 bg-opacity-40 p-4 rounded-xl ">
                            <div className='flex items-center justify-between'>
                                <h3 className="font-bold text-gray-200">{review.user}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="font-semibold text-gray-600">{review.rating}/10</span>
                                </div>
                            </div>
                            <p className="text-gray-300 mt-2">{review.reviewText}</p>
                        </div>
                    )):"No reviews available"}
                </div>
            </div>

        </div>
    )
}