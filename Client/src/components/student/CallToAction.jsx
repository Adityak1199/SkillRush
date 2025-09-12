import React from "react"
import { assets } from "../../assets/assets"

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-center pb-24 pt-10 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-gray-500 sm:text-sm">
        Join our community of learners and unlock your potential. Be a part of our vibrant learning<br />
        community and embark on a transformative educational journey.
      </p>

      <div className="flex items-center font-medium gap-6 mt-4 ">
        <button className="px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"> 
          Get Started
        </button>
        <button className="flex items-center gap-2">
          Learn More
          <img src={assets.arrow_icon} alt="arrow" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default CallToAction
