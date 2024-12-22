import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto my-auto'>
      
        <div className="relative bg-gradient-to-r from-violet-100 to-purple-400 sm:p-24 p-12 lg:p-32 rounded-lg ">

            <div className="">
                <h1 className="text-2xl sm:text-4xl font-bold mb-8 max-w-md">Download mobile app for better experience</h1>

                <div className="flex gap-4">
                    <a href="#" className="inline-block">
                        <img src={assets.play_store} alt="" className="h-12" />
                    </a>
                    <a href="#" className="inline-block">
                        <img src={assets.app_store} alt="" className="h-12" />
                    </a>
                </div>
            </div>

            <img src={assets.app_main_img} alt="" className="absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden" />

        </div>

    </div>
  )
}

export default AppDownload
