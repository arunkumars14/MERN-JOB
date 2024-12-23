import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { LoaderCircle } from "lucide-react"

const Application = () => {

  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext);

  const updateResume = async () => {
    try {
      setResumeLoading(true)
      if (resume) { 
        const formData = new FormData();
        formData.append('resume', resume);
        const token = await getToken();

        const { data } = await axios.post(backendUrl + '/api/user/update-resume', formData, { headers: { Authorization: `Bearer ${token}` } });

        if (data?.success) {
          toast.success(data.message);
          await fetchUserData();
          
        } else {
          toast.error(data.message)
        }
      }else{
        toast.error("Please upload resume")
      }

    } catch (error) {
      toast.error(error.message);
    }finally{
      setResumeLoading(false)
    }

    setIsEdit(false);
    setResume(null);

  }

  useEffect(() => {
    if(user){
      fetchUserApplications();
    }
  }, [user])


  return (
    <>

      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 my-10 mx-auto">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {
            isEdit || (userData && userData.resume === "") ? (
              <>
                <label htmlFor="resumeUpload" className="flex items-center">
                  <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">{resume ? resume.name : "Select Resume"}</p>

                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} type="file" hidden className="" accept='application/pdf' />

                  <img src={assets.profile_upload_icon} alt="" className="" />
                </label>

                <button onClick={updateResume} className="bg-green-100 border border-green-400 rounded-lg px-4 py-2">
                  {resumeLoading ? <LoaderCircle color='black' className='animate-spin'/>  : "Save"}
                </button>

                {userData.resume !== "" && <button onClick={ e => setIsEdit(false)} className="bg-red-100 border border-red-400 rounded-lg px-4 py-2">Cancel</button>}

              </>
            ) : (
              <div className="flex gap-2">
                <a href={userData?.resume} target='_blank' className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg ">
                  Resume
                </a>

                <button onClick={() => setIsEdit(true)} className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2">Edit</button>

              </div>
            )
          }
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>

        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="">
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody className="">
            {userApplications.reverse().map((job, index) => true ? (
              <tr key={index} className="">
                <td className="py-3 px-4 md:flex md:items-center gap-2 border-b">
                  <img src={job.companyId.image} alt="" className="w- h-8 max-md:hidden" />
                  {job.companyId.name}
                </td>
                <td className="py-2 px-4 border-b">
                  {job.jobId.title}
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">{job.jobId.location}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="py-2 px-4 border-b ">
                  <span className={`${job.status === "Accepted" ? "bg-green-100" : job.status === "Rejected" ? "bg-red-100" : "bg-blue-100"} px-4 py-1.5 rounded`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ) : (
              null
            ))}
          </tbody>
        </table>
      </div>

      <Footer />

    </>
  )
}

export default Application
