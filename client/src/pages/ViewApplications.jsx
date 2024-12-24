import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const ViewApplications = () => {
    const { companyToken, backendUrl } = useContext(AppContext);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchApplications, setSearchApplications] = useState('');
    const navigate = useNavigate()

    const fetchCompanyJobApplications = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/company/applicants', { headers: { token: companyToken } });

            if (data?.success) {
                setApplicants(data?.applications.reverse());
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const fetchCompanyJobApplicationsBySearch = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + `/api/company/applicants-search?query=${searchApplications}`, { headers: { token: companyToken } });

            if (data?.success) {
                setApplicants(data?.applications.reverse());
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const changeJobApplicationStatus = async (id, status) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/company/change-status', { id, status }, { headers: { token: companyToken } });
            if (data?.success) {
                fetchCompanyJobApplications()
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handlesearchApplication = () => {
        if (searchApplications !== "") {
            fetchCompanyJobApplicationsBySearch()
        } else {
            fetchCompanyJobApplications()
        }
    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobApplications()
        }
    }, [companyToken])



    return loading ? (
        <div className="w-[75vw] flex items-center justify-center h-[70vh]">
            <Loading />
        </div>
    ) : (
        <div className='container mx-auto p-4 '>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mb-5">

                <input type="email" placeholder='Search by title or location' onChange={e => setSearchApplications(e.target.value)} value={searchApplications} className="outline-none text-sm flex-1" />

                <img src={assets.search_icon} alt="" className="cursor-pointer" onClick={handlesearchApplication} />
            </div>


            <div className="">
                {applicants && applicants.length === 0 ? (
                    <div className="w-[75vw] flex flex-col items-center justify-center mt-14">
                        <p className="md:text-4xl max-md:text-2xl max-sm:text-xl font-bold text-blue-700 bg-blue-100 border-blue-700 p-2 rounded-md border">No one applied to this job</p>

                        <button onClick={() => navigate('/dashboard/manage-jobs')} className="mt-2 bg-gray-400 border p-2 rounded-md">
                            Dashboard
                        </button>
                    </div>) : (
                    <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
                        <thead className="">
                            <tr className="border-b">
                                <th className="py-2 px-4 text-left max-sm:hidden">#</th>
                                <th className="py-2 px-4 text-left">User name</th>
                                <th className="py-2 px-4 text-left max-sm:hidden">Job title</th>
                                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                                <th className="py-2 px-4 text-left">Resume</th>
                                <th className="py-2 px-4 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody className="">
                            {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                                <tr key={index} className="text-gray-700">
                                    <td className="py-2 px-4 border-b text-center max-sm:hidden">{index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center md:flex md:items-center">
                                        <img src={applicant.userId.image} alt="" className="w-10 h-10 rounded-full mr-3 max-md:hidden" />
                                        <span className="">{applicant.userId.name}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b max-sm:hidden">{applicant.jobId.title}</td>
                                    <td className="py-2 px-4 border-b max-sm:hidden">{applicant.jobId.location}</td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={applicant.userId.resume} target='_blank' className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center">
                                            Resume <img src={assets.resume_download_icon} alt="" className="" />
                                        </a>
                                    </td>
                                    <td className="py-2 px-4 border-b relative">
                                        {applicant.status === "Pending" ? <div className="relative inline-block text-left group">
                                            <button className="text-gray-500 action-button">
                                                ...
                                            </button>

                                            <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                                                <button onClick={() => changeJobApplicationStatus(applicant?._id, 'Accepted')} className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100">
                                                    Accept
                                                </button>
                                                <button onClick={() => changeJobApplicationStatus(applicant?._id, 'Rejected')} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                                                    Reject
                                                </button>
                                            </div>
                                        </div> : <div className={`${applicant.status === "Accepted" ? "bg-green-200 p-1.5 rounded" : "bg-red-200 p-1.5 rounded"}`}>
                                            {applicant.status}
                                        </div>}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    )
}

export default ViewApplications
