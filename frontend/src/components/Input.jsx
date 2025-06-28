import React from 'react'

const Input = ({icon:Icon,...props}) => {
  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <Icon className='size-5 text-white' />
      </div>
      <input 
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-700 bg-opacity-20 rounded-lg border border-gray-700 focus:border-[#e6e6e6] text-white placeholder-gray-300 transition duration-200 focus:outline-none"
      />
    </div>
  )
}

export default Input
