import React from 'react'
import Quote from '../components/Quote'
import Auth from '../components/Auth'

const Signin = () => {
  return (
    <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
      <Auth authType='signin' />
      <Quote />
    </div>
  )
}

export default Signin