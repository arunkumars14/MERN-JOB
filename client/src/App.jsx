import React, { useContext } from 'react'
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Application from './pages/Application'
import ApplyJob from './pages/ApplyJob'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import MangageJobs from './pages/MangageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'

const App = () => {

  const {showRecruiterLogin } = useContext(AppContext)


  return (
    <div>

      {showRecruiterLogin && <RecruiterLogin />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/applications' element={<Application />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />

        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />} />
          <Route path='manage-jobs' element={<MangageJobs />} />
          <Route path='view-application' element={<ViewApplications />} />
        </Route>

      </Routes>

    </div>
  )
}

export default App