import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  const {companyToken} = useContext(AppContext)

  const goBack = () => {
    navigate(-1);
  }

  return companyToken ? (
    <div className="w-screen h-screen flex items-center flex-col p-2 m-3">
      <p className="text-cyan-400 bg-black h-fit p-3 rounded-xl font-medium">You are authenticated as recruiter</p>
      <button onClick={goBack} className="bg-cyan-100 border border-cyan-500 text-cyan-400 mt-3 p-3 font-semibold rounded-md">Go back</button>
      

    </div>
  ) : (
    <div>
      <Navbar />
      <Hero />
      <JobListing />
      <AppDownload />
      <Footer />
    </div>
  )
}

export default Home
