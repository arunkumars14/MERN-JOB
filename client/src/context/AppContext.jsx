import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";


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


    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data?.jobs)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } });

            if (data.success) {
                setCompanyData(data.company)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const {data} = await axios.get(backendUrl + '/api/user/user', {headers: {Authorization: `Bearer ${token}`}})
            
            if(data.success){
                setUserData(data.user);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchUserApplications = async () => {
        try {
            const token = await getToken();
            const {data} = await axios.get(backendUrl + '/api/user/applications',{headers: {Authorization: `Bearer ${token}`}});
            if(data?.success){
                setUserApplications(data.applications);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
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
        searchFilter, setSearchFilter, isSearched, setIsSearched, jobs, setJobs, showRecruiterLogin, setShowRecruiterLogin, companyToken, setCompanyToken, companyData, setCompanyData, backendUrl, userData, setUserData, userApplications, setUserApplications, fetchUserData, fetchUserApplications
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

