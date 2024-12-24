import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { LoaderCircleIcon } from "lucide-react";
import { assets } from "../assets/assets";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    })
    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(localStorage.getItem('companyToken') || null);
    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplications] = useState([]);
    const [userApplicationLoading, setuserApplicationLoading] = useState(true)
    const [contextloading, setcontextloading] = useState(true)


    const fetchJobs = async () => {
        try {
            setcontextloading(true)
            const { data } = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data?.jobs)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }finally{
            setcontextloading(false)
        }
    }

    const fetchCompanyData = async () => {
        try {
            setcontextloading(true)
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } });

            if (data.success) {
                setCompanyData(data.company)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setcontextloading(false)
        }
    }

    const fetchUserData = async () => {
        try {
            setcontextloading(true)
            const token = await getToken();
            const {data} = await axios.get(backendUrl + '/api/user/user', {headers: {Authorization: `Bearer ${token}`}})
            
            if(data.success){
                setUserData(data.user);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }finally{
            setcontextloading(false)
        }
    }

    const fetchUserApplications = async () => {
        try {
            setuserApplicationLoading(true)
            const token = await getToken();
            const {data} = await axios.get(backendUrl + '/api/user/applications',{headers: {Authorization: `Bearer ${token}`}});
            if(data?.success){
                setUserApplications(data.applications);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setuserApplicationLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    useEffect(() => {
        if(user){
            fetchUserData();
            fetchUserApplications();
        }

    }, [user])

    const value = {
        searchFilter, setSearchFilter, isSearched, setIsSearched, jobs, setJobs, showRecruiterLogin, setShowRecruiterLogin, companyToken, setCompanyToken, companyData, setCompanyData, backendUrl, userData, setUserData, userApplications, setUserApplications, fetchUserData, fetchUserApplications, userApplicationLoading, setuserApplicationLoading
    }

    if(contextloading && userApplicationLoading){
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <LoaderCircleIcon className="animate-spin text-sky-500" size={50} />
                <div className="mt-3">
                    <img src={assets.logo} alt="" className="" />
                    
                </div>

            </div>
        )
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

