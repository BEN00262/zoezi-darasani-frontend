import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { GlobalContext } from '../contexts/GlobalContext';
import { ITeacherComp } from './TeacherDisplayPage';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export interface ISelectableData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

const NewGrade = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);

    const [grades, setGrades] = useState<ISelectableData[]>([
        { _id: "random1", label: "One", value: "One"},
        { _id: "random2", label: "Two", value: "Two"},
        { _id: "random3", label: "Three", value: "Three"}
    ])

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);
    const [gradeDetails, setGradeDetails] = useState<{
        grade: string
        teacherId: string
        stream: string
        year: number
    }>({ teacherId: "", grade: "", stream: "", year: (new Date()).getFullYear() })

    const success_toastify = () => toast.success("Successfully imported learner(s)!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })


    useEffect(() => {
        axios.get("/api/teacher/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
            .then(({ data }) => {
                if (data) {
                    let _teachers = data.teachers as ITeacherComp[]
                    setTeachers(_teachers.map(({ _id, name, email }) => ({
                        label: `${name} | ${email}`,
                        _id, value: _id
                    })))
                }
            })
    }, []);


    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        axios.post("/api/grade", gradeDetails, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        return success_toastify();
                    }
                }
            })
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
             <div className='container'>
            <div className="section">
                <div className="row">
                    <ToastContainer/>
                    <form method='post' onSubmit={handleFormSubmission} className="col s12 m6 push-m3">
                            
                        <div className="col s12 m12">
                            {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                            <label>Select Grade</label>
                            <Select
                                onChange={item => {
                                    setGradeDetails(old => ({
                                        ...old,
                                        grade: (item?.value || "")
                                    }))
                                }}
                                options={grades} 
                                placeholder="choose grade..."/>
                            
                        </div>

                        <div className="col s12 m12">
                            <label htmlFor="year">Grade Year</label>
                            <input type="number" value={gradeDetails.year} id='year' onChange={e => {
                                setGradeDetails(old => ({
                                    ...old,
                                    [e.target.name]: e.target.value
                                }))
                            }} name="year"/>
                        </div>

                        <div className="col s12 m12">
                            <label htmlFor="stream">Grade stream</label>
                            <input type="text" id='stream' value={gradeDetails.stream} onChange={e => {
                                setGradeDetails(old => ({
                                    ...old,
                                    [e.target.name]: e.target.value
                                }))
                            }} name="stream"/>
                        </div>

                        {/* attaching to a teacher */}
                        <div className="col s12 m12">
                            {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                            <label>Assign Class Teacher</label>
                            <Select
                                isSearchable={true}
                                onChange={item => {
                                    setGradeDetails(old => ({
                                        ...old,
                                        teacherId: (item?.value || "")
                                    }))
                                }}
                                options={teachers} 
                                placeholder="choose teacher..."/>
                            
                        </div>

                        <div className="col s12 m12" style={{
                            marginTop: "10px"
                        }}>
                            <button className="btn-small">Create Grade</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </main>
    )
}

export default NewGrade