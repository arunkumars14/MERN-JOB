import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'

const AddJob = () => {

    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('Bangalore')
    const [category, setCategory] = useState('Programming')
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow'
            })

        }
    }, [])

    return (
        <form action="" className="container p-4 flex-col flex items-start w-full gap-3">
            <div className="w-full">
                <p className="mb-2">
                    Job Title
                </p>
                <input type="text" onChange={e => setTitle(e.target.value)} placeholder='Type here' value={title} required className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded" />

            </div>

            <div className="w-full max-w-lg">
                <p className="my-2">Job Description</p>

                <div ref={editorRef} className="">

                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div className="">
                    <p className="mb-2">Job Category</p>

                    <select name="" id="" className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setCategory(e.target.value)}>
                        {JobCategories.map((category, index) => (
                            <option key={index} value={category} className="">{category}</option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <p className="mb-2">Job Location</p>

                    <select name="" id="" className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLocation(e.target.value)}>
                        {JobLocations.map((location, index) => (
                            <option key={index} value={location} className="">{location}</option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <p className="mb-2">Job Level</p>

                    <select name="" id="" className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={e => setLevel(e.target.value)}>

                        <option value={"Beginner Level"} className="">Beginner Level</option>
                        <option value={"Intermediate Level"} className="">Intermediate Level</option>
                        <option value={"Senior Level"} className="">Senior Level</option>

                    </select>
                </div>
            </div>

            <div className="">
                <p className="mb-2">Job Salary</p>
                <input min={0} onChange={e => setSalary(e.target.value)} type="number" placeholder='2500' className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120x]" />
            </div>

            <button className="w-28 rounded py-3 mt-4 bg-black text-white">
                Add
            </button>
        </form>
    )
}

export default AddJob