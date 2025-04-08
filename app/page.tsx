import BgGradient from '@/components/common/bg-gradient'
import DemoSection from '@/components/Home/Demo-section'
import { HeroSection } from '@/components/Home/page'
import React from 'react'

const Home = () => {
  return (
    <div className='relative w-full'>
      <BgGradient/>
      <div className='flex flex-col'>


      <HeroSection/>
      <DemoSection/>
      </div>
    </div>
  )
}

export default Home
