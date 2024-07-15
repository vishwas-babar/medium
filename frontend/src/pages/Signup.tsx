import React from 'react'
import Auth from '../components/Auth'
import Quote from '../components/Quote'

const Signup = () => {
  return (
    <div>
      <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
        <Auth authType='signup' />
        <Quote />
      </div>
    </div>
  )
}

export default Signup