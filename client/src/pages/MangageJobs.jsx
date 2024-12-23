import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { LoaderCircleIcon } from 'lucide-react'

const MangageJobs = () => {
    const navigate = useNavigate();

    const { backendUrl, companyToken } = useContext(AppContext);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCompanyJobs = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/company/list-jobs', { headers: { token: companyToken } });

            if (data?.success) {
                setJobs(data?.jobsData.reverse())
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    }

    const changeJobVisiblity = async (id) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/company/change-visiblity', { id }, { headers: { token: companyToken } })

            if (data.success) {
                toast.success(data?.message)
                fetchCompanyJobs();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }

    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs();
        }
    }, [companyToken])

    return loading ? (
        <div className="w-[75vw] flex items-center justify-center h-[70vh]">
            <Loading />
        </div>
    ) : jobs && jobs.length === 0 ? (
        <div className="w-[75vw] flex flex-col items-center justify-center mt-14">
            <p className="md:text-4xl max-md:text-2xl max-sm:text-xl font-bold text-blue-700 bg-blue-100 p-5 rounded-md">No jobs posted</p>

        </div>
    ) : (
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
                        {jobs.map((job, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{job.title}</td>
                                <td className="py-2 px-4 border-b max-sm:hidden"> {moment(job.date).format('ll')} </td>
                                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                                <td className="py-2 px-4 border-b text-center">{job.applicants}</td>
                                <td className="py-2 px-4 border-b">
                                    <input type="checkbox" className="scale-125 ml-4" onChange={() => changeJobVisiblity(job._id)} checked={job.visible} />
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
