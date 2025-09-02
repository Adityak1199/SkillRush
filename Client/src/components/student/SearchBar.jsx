import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandle = (e) => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <form
      onSubmit={onSearchHandle}
      className='max-w-xl w-full md:h-10 h-12 flex items-center bg-white rounded border border-gray-500/20'
    >
      <img
        src={assets.search_icon}
        className="md:w-auto w-10 px-3"
        alt="search-icon"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder='Search for Courses'
        className='w-full h-full outline-none text-gray-500/80'
      />
      <button
        type='submit'
        className='bg-blue-600 text-white px-5 py-2 rounded md:px-10 md:py-3 mx-1 px-7'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
