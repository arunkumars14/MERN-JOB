import React from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const MangageJobs = () => {
    const navigate = useNavigate()
    return (
        <div className='container p-4 max-w-5xl'>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
                    <thead className="">
                        <tr className="">
                            <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
                            <th className="py-2 px-4 border-b text-center">Job Title</th>
                            <th className="py-2 px-4 border-b text-center max-sm:hidden"> Date</th>
                            <th className="py-2 px-4 border-b text-center max-sm:hidden">Location</th>
                            <th className="py-2 px-4 border-b text-center">Applicants</th>
                            <th className="py-2 px-4 border-b text-center">Visible</th>
                        </tr>
                    </thead>

                    <tbody className="">
                        {manageJobsData.map((job, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{job.title}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden"> {moment(job.date).format('ll')} </td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                                <td className="py-2 px-4 border-b text-center">{job.applicants}</td>
                                <td className="py-2 px-4 border-b">
                                    <input type="checkbox" className="scale-125 ml-4" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <button onClick={() => navigate("/dashboard/add-job")} className="bg-black text-white py-2 px-4 rounded">Add New Job</button>
            </div>
        </div>
    )
}

export default MangageJobs
