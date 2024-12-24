import React, { useContext, useEffect, useState } from 'react'
import { assets, manageJobsData } from '../assets/assets'
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
    const [jobsForDate, setJobsForDate] = useState([]);
    const [loading, setLoading] = useState(false);
    const [manageJobs, setManageJobs] = useState('');
    const [manageJobsDate, setManageJobsDate] = useState('');
    const [manageJobsODate, setManageJobsODate] = useState('');

    const fetchCompanyJobs = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/company/list-jobs', { headers: { token: companyToken } });

            if (data?.success) {
                setJobs(data?.jobsData)
                setJobsForDate(data?.jobsData)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    }

    const fetchCompanyJobsBySearch = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + `/api/company/list-jobs-search?query=${manageJobs}`, { headers: { token: companyToken } });

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

    const handlesearchJobs = () => {
        if (manageJobs !== "") {
            fetchCompanyJobsBySearch()
        } else {
            fetchCompanyJobs()
        }
    }

    const handleSearchByDate = async (e) => {
        const originalDate = e.target.value;
        
        setManageJobsODate(originalDate);

        if (originalDate === "") {
            
            setManageJobsDate("");
            fetchCompanyJobs();
            return;

        } else {
            setManageJobsDate(originalDate)
            
            const [year, month, day] = originalDate.split("-").map(Number);

            

            const jobsCopy = [...jobsForDate];
            

            const results = jobsCopy.filter((job) => {
                const jobDate = new Date(job.date);
                
                return (
                    jobDate.getUTCFullYear() === year &&
                    jobDate.getUTCMonth() + 1 === month &&
                    jobDate.getUTCDate() === day
                );
            });

            
            if (results.length !== 0) {
                setJobs(results)
            } else {
                setJobs([])
            }

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
    ) : (
        <div className='container p-4 max-w-5xl'>

            <div className="flex items-center gap-2 mb-5">
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full flex-1">

                    <input type="email" placeholder='Search by title or location' onChange={e => setManageJobs(e.target.value)} value={manageJobs} className="outline-none text-sm flex-1" />

                    <img src={assets.search_icon} alt="" className="cursor-pointer" onClick={handlesearchJobs} />
                </div>


                <div className="border px-4 py-2 rounded-full">


                    <input type="date" className='w-5' onChange={handleSearchByDate} />

                </div>


            </div>

            <div className="overflow-x-auto">
                {jobs && jobs.length === 0 ? (
                    <div className="w-[75vw] flex flex-col items-center justify-center mt-14">
                        <p className="md:text-4xl max-md:text-2xl max-sm:text-xl font-bold text-blue-700 bg-blue-100 p-5 rounded-md">No jobs posted</p>

                    </div>
                ) : (
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
                )}

            </div>

            <div className="mt-4 flex justify-end">
                <button onClick={() => navigate("/dashboard/add-job")} className="bg-black text-white py-2 px-4 rounded">Add New Job</button>
            </div>
        </div>
    )
}

export default MangageJobs
