import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { GlobalContext } from '../contexts/GlobalContext';
import { ISelectableData } from './NewGrade';
import { ITeacherComp } from './TeacherDisplayPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

interface ISubjectData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

const NewSubject = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { authToken } = useContext(GlobalContext);
    const [subjects, setSubjects] = useState<ISubjectData[]>([]);
    const [error, setError] = useState("");
    const [isCreactingSubject, setIsCreatingSubject] = useState(false);

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);
    const [subjectDetails, setSubjectDetails] = useState<{
        teacherId: string
        subject: string
    }>({ teacherId: "", subject: "" });

    const success_toastify = () => toast.success("Successfully created subject!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })

    const error_toastify = (message: string) => toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        progress: 0,
        autoClose: false
    })


    useEffect(() => {
        Promise.all([
            axios.get(`/api/misc/subjects/${params.gradeName}`, { headers: { 'Authorization': `Bearer ${authToken}`}}),
            axios.get("/api/teacher/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
        ])
            .then(([{ data: _subjects }, { data }]) => {

                if (_subjects) {
                    if (_subjects.status) {
                        setSubjects(
                            (_subjects.subjects as string[]).map((x, index) => ({
                                label: x,
                                value: x,
                                _id: `${index}`
                            }))
                        )
                    } else {
                        // there was an error and we need to crush
                        error_toastify("Failed to load grades");
                        return
                    }
                }



                if (data) {
                    let _teachers = data.teachers as ITeacherComp[]
                    setTeachers(_teachers.map(({ _id, name, email }) => ({
                        label: `${name} | ${email}`,
                        _id, value: _id
                    })))

                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                error_toastify(error.message);
            })
    }, []);

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        // get the current stuff and use it
        const classId = localStorage.getItem("classId") || "";
        setIsCreatingSubject(true);

        // console.log(learnerDetails);
        axios.post(`/api/subject/${classId}`, subjectDetails, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        return success_toastify();
                    }

                    setError(data.error);
                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                setError(error.message)
            })
            .finally(() => {
                setIsCreatingSubject(false);
            })
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
                <div className='container'>
            <div className="section">
                {
                    error ?
                    <div className="row">
                        <div className="col s12 m6 push-m3">
                            <div className="sub-modal-texts" style={{
                                borderLeft: "2px solid red",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                borderRadius: "3px",
                                lineHeight: "4em",
                                backgroundColor: "rgba(255,0,0, 0.1)",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <i className="material-icons left">error_outline</i>
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                    : null
                }
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
                        <button className="btn-small">{isCreactingSubject ? "Creating subject..." : "Create Subject"}</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </main>
    )
}

export default NewSubject