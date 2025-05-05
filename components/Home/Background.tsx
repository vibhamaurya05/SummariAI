import React from 'react'
import Hero from './Hero'

const Background = () => {
  return (
    <>
    <div className="relative top-0 left-0 w-full h-[130vh] bg-gradient-to-b from-transparent via-transparent to-blue-800 rounded-b-2xl -z-10" >
     <div className='absolute '>
        <Hero/>

     </div>
     <div className='absolute top-[110vh] left-6  h-full w-[96%] mx-auto rounded-xl bg-stone-900 border-l-[1px] border-r-[1px] border-stone-50 '>

     </div>

      
    </div>
    </>
  )
}

export default Background
