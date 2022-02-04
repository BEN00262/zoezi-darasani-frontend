import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { GlobalContext } from '../contexts/GlobalContext';
import { ISelectableData } from './NewGrade';
import { ITeacherComp } from './TeacherDisplayPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface ISubjectData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

const NewSubject = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);
    const [subjects, setSubjects] = useState<ISubjectData[]>([
        { _id: "random1", label: "English", value: "English"},
        { _id: "random2", label: "Kiswahili", value: "Kiswahili"},
        { _id: "random3", label: "Science", value: "Science"}
    ]);

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);
    const [subjectDetails, setSubjectDetails] = useState<{
        teacherId: string
        subject: string
    }>({ teacherId: "", subject: "" });

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

        // get the current stuff and use it
        const classId = localStorage.getItem("classId") || "";

        // console.log(learnerDetails);
        axios.post(`/api/subject/${classId}`, subjectDetails, {
            headers: { Authorization: `Bearer ${authToken}`}
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
                        <label>Select Subject</label>
                        <Select
                            onChange={item => {
                                setSubjectDetails(old => ({
                                    ...old,
                                    subject: item?.value || ""
                                }))
                            }}
                            options={subjects} 
                            placeholder="choose subject..."/>
                        
                    </div>

                    {/* attaching to a teacher */}
                    <div className="col s12 m12">
                        {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                        <label>Assign Teacher</label>
                        <Select
                            onChange={item => {
                                setSubjectDetails(old => ({
                                    ...old,
                                    teacherId: item?.value || ""
                                }))
                            }}
                            options={teachers} 
                            placeholder="choose teacher..."/>
                        
                    </div>

                    <div className="col s12 m12" style={{
                        marginTop: "10px"
                    }}>
                        <button className="btn-small">Create Subject</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </main>
    )
}

export default NewSubject